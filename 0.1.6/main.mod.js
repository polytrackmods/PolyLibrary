import { PolyMod, MixinType } from "https://pml.crjakob.com/cb/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js";

class polyLibrary extends PolyMod {
    soundInst;
    initMod = function() {
        const uistyle = document.createElement("style");
        uistyle.textContent = `
        .mod-library {
            position: absolute;
            top: 0;
            left: 0;
            background-color: #28346a;
            width: 200px;
            height: 100px;
            align-content: center;
            text-align: center;
            pointer-events: auto;
            z-index: 1;
        }
        
        .library-open-button {
            cursor: pointer;
            background: #112052;
            color: white;
            border: none;
            height: 40px;
            width: 180px;
            margin: 10px;
            clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
        }
        .library-open-text {
            color: white;
            font-size: 25px;
            margin: 0;
            padding: 0;
        }
        .library-div {
            color: white;
            height: 100%;
            width: 1000px;
            position: absolute;
            left: calc(50% - 1000px / 2);
            background: #28346a;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
        }
        .top-text {
            margin: 10px 10px 0 10px;
            padding: 0;
            font-weight: normal;
            font-size: 50px;
            text-align: center;
            color: white;
        }
        .tag-div {
            background: #212b58;
            width: 960px;
            height: 50px;
            white-space: nowrap;
            position: relative;
            overflow-x: scroll;
            overflow-y: hidden;
            scrollbar-width: none;
            color: white;
            align-items: center;
            padding: 20px;
            gap: 30px;
            display: flex;
            flex-direction: row;
            pointer-events: auto;
        }
        .library-back-button {
            margin: 10px;
            padding: 10px 20px;
            float: left;
        }
        .library-refr-button {
            margin: 10px;
            padding: 10px 20px;
            float: right;
        }
        .library-list {
            margin: 0;
            padding: 0;
            flex: 1;
            background-color: #212b58;
            overflow-x: hidden;
            overflow-y: scroll;
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            color: white;
            text-align: center;
        }
        button.tag-box {
            height: 100%;
            width: 100px;
            clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
            display: flex;
            align-items: center;
            background: #112052;
            justify-content: center;
            padding: 0 80px;
        }
        .mini-tag {
            padding: 0 20px;
            height: 20px;
            width: 50px;
            clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
            display: flex;
            align-items: center;
            background: #28346a;
            justify-content: center;
            margin: 10px 0px 20px 20px;
            font-size: 20px;
        }
        .library-entry {
            display: flex;
            height: 180px;
            width: 925px;
            background: #112052;
            flex-shrink: 0;
            color: white;
            align-items: center;
        }
        .library-text-holder {
            padding: 20px;
            text-align: left;
            margin-bottom: auto;
            align-items: end;
        }
        button.tag-box.select-tag {
            background: #334b77;
        }
        .mod-top {
            color: white;
            display: flex;
            gap: 20px;
            padding: 30px
        }
        .library-add-button {
            height: 60px;
            margin-left: auto;
            width: 175px;
        }
        .tab-div {
            background: #212b58;
            height: 100px;
            width: 100%;
            display: flex;
            flex-direction: row;
            gap: 150px;
            justify-content: center;
            font-size: 30px;
            align-items: center;
        }
        .und-select {
            text-decoration: underline;
        }
        .tab-hidden {
            display: none !important;
        }
        .changelog-list {
            flex: 1;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            padding: 20px;
            gap: 40px;
            overflow-y: scroll;
            pointer-events: auto;
        }
        .changelog-entry {
            background: #212b58;
            width: 100%;
            display: flex;
            flex-direction: column;
        }
        .versions-list {
            overflow-y: scroll;
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px;
            flex: 1;
        }
        .versions-entry {
            background: #212b58;
            width: 100%;
            display: flex;
            flex-direction: row;
        }
        .desc-box {
            font-size: 20px;
            margin-left: auto;
            width: 280px;
            overflow: hidden;
            height: 120px;
        }
        .desc-text {
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        `;
        
        document.head.appendChild(uistyle);

        this.tagButtons = [];
        this.iconMap;
    }
    menuUI = function() {
        const uiDiv = document.getElementById("ui");
        if (!uiDiv) return;
        
        const baseDiv = document.createElement("div");
        baseDiv.className = "mod-library";
        baseDiv.id = "poly-library"
        
        uiDiv.appendChild(baseDiv);
        
        const libraryOpenText = document.createElement("p");
        libraryOpenText.className = "library-open-text";
        libraryOpenText.textContent = "Mod Library";
        
        baseDiv.appendChild(libraryOpenText);
            
        const libraryOpenButton = document.createElement("button");
        libraryOpenButton.className = "library-open-button button"
        libraryOpenButton.textContent = "Open";  
        libraryOpenButton.onclick = () => {
            document.getElementsByClassName("track-info")[0].remove();
            this.libraryUI(uiDiv)
            baseDiv.remove();
        };
        
        baseDiv.appendChild(libraryOpenButton);
    }
    libraryUI = async function(uiDiv) {
        this.fullModList = await this.getModList();
        
        const baseDiv = document.createElement("div");
        baseDiv.className = "library-div";
        baseDiv.id = "library-div";

        uiDiv.appendChild(baseDiv);

        const topText = document.createElement("h2");
        topText.textContent = "Mod Library";
        topText.className = "top-text";

        baseDiv.appendChild(topText);

        this.tagDiv = document.createElement("div");
        this.tagDiv.className = "tag-div";
        this.tagDiv.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.tagDiv.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        baseDiv.appendChild(this.tagDiv);

        this.listDiv = document.createElement("div");
        this.listDiv.className = "library-list"

        baseDiv.appendChild(this.listDiv);

        const bottomDiv = document.createElement("div");
        bottomDiv.className = "bottom-bar";
        bottomDiv.style.marginTop = "auto";
        bottomDiv.style.padding = "10px";

        baseDiv.appendChild(bottomDiv)
        
        const backButton = document.createElement("button");
        backButton.className =  "library-back-button button";
        backButton.innerHTML = `<img src="images/back.svg"> Back`;
        backButton.onclick = () => {
            baseDiv.remove();
            window.ActivePolyModLoader.getMod("pmlcore").createModScreen(this.soundInst);
            this.menuUI();
        };

        bottomDiv.appendChild(backButton);

        const refreshButton = document.createElement("button");
        refreshButton.className =  "library-refr-button button";
        refreshButton.innerHTML = `<img src="images/redo.svg"> Refresh`;
        refreshButton.onclick = async () => {
            this.listDiv.innerHTML = '';
            this.tagDiv.innerHTML = ''

            this.loader = document.createElement("p");
            this.loader.textContent = "Loading Library...";
            this.loader.id = "library-load";
    
            this.listDiv.appendChild(this.loader);

            this.getModInfo(this.fullModList, true);
        };

        bottomDiv.appendChild(refreshButton);

        this.loader = document.createElement("p");
        this.loader.textContent = "Loading Library...";
        this.loader.id = "library-load";

        this.listDiv.appendChild(this.loader);

        this.getModInfo(this.fullModList);
    };
    createTagBar = function(tagList) {
        this.loader.remove(this.loader);
        
        const allTagBox = document.createElement("button");
        allTagBox.textContent = "All";
        allTagBox.className = "tag-box button select-tag";
        allTagBox.id = "all"
        allTagBox.onclick = () => {
            allTagBox.classList.add("select-tag");
            for (const child of this.listDiv.children) {
                child.style.display = "flex";
            };
            this.tagButtons.forEach((button) => {
                button.id === "all" ? button.classList.add("select-tag") : button.classList.remove("select-tag");
            })
        };

        this.tagButtons.push(allTagBox);
        
        this.tagDiv.appendChild(allTagBox);
        
        for (const tag of tagList) {
            const tagBox = document.createElement("button");
            tagBox.textContent = tag;
            tagBox.className = "tag-box button";
            tagBox.id = tag;
            tagBox.onclick = () => {
                this.tagVisibility(tag, tagList);
            };

            this.tagDiv.appendChild(tagBox);

            this.tagButtons.push(tagBox);
        }
    };
    tagVisibility = function(curtag, allTags) {
       
        const index = allTags.indexOf(curtag);
        if (index === -1) return;
        const otherTags = allTags.slice(); 
        otherTags.splice(index, 1);
        otherTags.forEach((tag) => {
            const tagEntries = document.getElementsByClassName(tag);
            for (const element of tagEntries) {
                element.style.display = "none";
            };
        });

        const showtag = document.getElementsByClassName(curtag);
        for (const element of showtag) {
            element.style.display = "flex";
        };

        this.tagButtons.forEach((button) => {
            button.id === curtag ? button.classList.add("select-tag") : button.classList.remove("select-tag");
        })

    };
    createModEntry = function(modId, modName, modInfo, modLatest, icons) {
        const modAuthor = modInfo.author;
        let modIcon = icons[modId];
        const modVersions = modLatest.mods[modId].latest;
        const tags = modLatest.mods[modId].tags;
        const shortDesc = modLatest.mods[modId].shortDesc;

        const entry = document.createElement("button");
        if (!(this.gameVersion in modVersions)) {
            entry.style.opacity = "0.5";
            entry.disabled = true;
            entry.style.cursor = "not-allowed"
        }
        entry.className = `library-entry button ${tags.join(" ")}`;
        entry.onclick = () => {
            document.getElementById("library-div").style.display = "none";
            this.createModUI(modId, modLatest.mods[modId], modIcon, modName, modAuthor, tags);
        };

        this.listDiv.appendChild(entry)

        if (modIcon instanceof Node) {
            entry.appendChild(modIcon);
        } else {
            modIcon = document.createElement("img");
            modIcon.src = "./images/empty.svg";
            modIcon.style.height = "150px";

            entry.appendChild(modIcon);
        }

        const bigDiv = document.createElement("div");
        bigDiv.className = "content-div";
        bigDiv.style.textAlign = "left";

        entry.appendChild(bigDiv)

        const descDiv = document.createElement("div");
        descDiv.className = "desc-box";

        const descText = document.createElement("p");
        descText.className = "desc-text";
        descText.textContent = shortDesc;

        descDiv.appendChild(descText);

        entry.appendChild(descDiv);

        const textDiv = document.createElement("div");
        textDiv.className = "library-text-holder";

        bigDiv.appendChild(textDiv)

        const modNameLib = document.createElement("h2");
        modNameLib.textContent = modName;
        modNameLib.style.fontSize = "40px";
        modNameLib.style.margin = "0";
        modNameLib.style.textDecoration = "underline";
        modNameLib.style.fontStyle = "normal";

        textDiv.appendChild(modNameLib);

        const modAuthorLib = document.createElement("p");
        modAuthorLib.textContent = `By: ${modAuthor}`;
        modAuthorLib.style.fontSize = "20px";
        modAuthorLib.style.margin = "0";

        textDiv.appendChild(modAuthorLib);

        const versionsDiv = document.createElement("p");
        versionsDiv.textContent = Object.keys(modVersions).join(", ");
        versionsDiv.style.margin = "0";
        versionsDiv.style.padding = "20px 0px 0 30px";
        versionsDiv.style.fontSize = "20px";

        bigDiv.appendChild(versionsDiv);

        const modTags = document.createElement("div");
        modTags.style.display = "flex";
        modTags.style.flexDirection = "row";
        tags.forEach((tag) => {
            const tagBox = document.createElement("div");
            tagBox.textContent = tag;
            tagBox.className = "mini-tag";

            modTags.appendChild(tagBox);
        });

        bigDiv.appendChild(modTags);
    };
    createModUI = async function(modId, thisMod, icon, name, author, tags) {
        const baseDiv = document.createElement("div");
        baseDiv.className = "library-div";
        baseDiv.id = "mod-div";


        const topDiv = document.createElement("div");
        topDiv.className = "mod-top";

        baseDiv.appendChild(topDiv);

        topDiv.appendChild(icon.cloneNode(true));

        const textDiv = document.createElement("div");
        textDiv.className = "library-text-holder";

        topDiv.appendChild(textDiv)

        const modNameLib = document.createElement("h2");
        modNameLib.textContent = name;
        modNameLib.style.fontSize = "40px";
        modNameLib.style.margin = "0";
        modNameLib.style.textDecoration = "underline";
        modNameLib.style.fontStyle = "normal";
        modNameLib.style.whiteSpace = "nowrap";
        modNameLib.style.overflow = "hidden";
        modNameLib.style.textOverflow = "ellipsis";
        


        textDiv.appendChild(modNameLib);

        const modAuthorLib = document.createElement("p");
        modAuthorLib.textContent = `By: ${author}`;
        modAuthorLib.style.fontSize = "20px";
        modAuthorLib.style.margin = "0";

        textDiv.appendChild(modAuthorLib);

        const addButton = document.createElement("button");
        addButton.className =  "library-add-button button";
        addButton.style.marginLeft = "auto";
        addButton.innerHTML = `<img src="images/apply.svg"> Add`;
        addButton.onclick = async () => {await this.getDependencies(modId, thisMod.baseUrl, thisMod.latest[Activewindow.ActivePolyModLoaderPolyModLoader.polyVersion], true)};

        topDiv.appendChild(addButton);

        for (let polyMod of window.ActivePolyModLoader.getAllMods()) {
            console.log(polyMod);
        }
        
        if (window.ActivePolyModLoader.getMod(modId)) {
            addButton.disabled = true;
            addButton.style.cursor = "not-allowed"
        };

        const desc = document.createElement("div");
        desc.innerHTML = "Loading Description..."
        desc.style.flex = "1";
        desc.style.background = "#212b58";
        desc.style.marginTop = "40px";
        desc.style.overflowY = "scroll";
        desc.style.pointerEvents = "auto";
        desc.style.padding = "20px"

        this.changelog = document.createElement("div");
        this.changelog.className = "changelog-list tab-hidden";


        this.vers = document.createElement("div");
        this.vers.className = "versions-list tab-hidden"

        const tabsDiv = document.createElement("div");
        tabsDiv.className = "tab-div";

        baseDiv.appendChild(tabsDiv);

        const tab1 = document.createElement("button");
        tab1.style.background = "none";
        tab1.className = "button und-select";
        tab1.textContent = "Overview";
        tab1.onclick = () => {
            this.switchTab(tab1);
            desc.classList.remove("tab-hidden");
            this.changelog?.classList.add("tab-hidden");
            this.vers?.classList.add("tab-hidden");
        };

        const tab2 = document.createElement("button");
        tab2.style.background = "none";
        tab2.className = "button";
        tab2.textContent = "Changelog";
        tab2.onclick = () => {
            this.switchTab(tab2);
            if (!this.changelog.classList.contains("created")) {this.createChangelog(thisMod)};
            desc.classList.add("tab-hidden");
            this.changelog.classList.remove("tab-hidden");
            this.vers.classList.add("tab-hidden");
        };

        const tab3 = document.createElement("button");
        tab3.style.background = "none";
        tab3.className = "button";
        tab3.textContent = "Versions";
        tab3.onclick = () => {
            this.switchTab(tab3);
            if (!this.vers.classList.contains("created")) {this.createVersions(thisMod, modId)};
            desc.classList.add("tab-hidden");
            this.changelog?.classList.add("tab-hidden");
            this.vers?.classList.remove("tab-hidden");
        };

        tabsDiv.appendChild(tab1);
        tabsDiv.appendChild(tab2);
        tabsDiv.appendChild(tab3);

        baseDiv.appendChild(desc);
        baseDiv.appendChild(this.changelog);
        baseDiv.appendChild(this.vers);

        const bottomDiv = document.createElement("div");
        bottomDiv.className = "bottom-bar";
        bottomDiv.style.padding = "10px";
        bottomDiv.style.marginTop = "auto";

        baseDiv.appendChild(bottomDiv)
        
        const backButton = document.createElement("button");
        backButton.className =  "library-back-button button";
        backButton.innerHTML = `<img src="images/back.svg"> Back`;
        backButton.onclick = () => {
            baseDiv.remove();
            document.getElementById("library-div").style.display = "flex";
        };

        bottomDiv.appendChild(backButton);


        document.getElementById("ui").appendChild(baseDiv);

        const html = await this.getDescription(modId, thisMod);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        
        const styleTags = tempDiv.querySelectorAll("style");
        
        styleTags.forEach(styleTag => {
          styleTag.textContent = styleTag.textContent.replace(/font-family\s*:\s*[^;]+;?/gi, '');
        });
        
        desc.innerHTML = tempDiv.innerHTML;

    };
    confirmPopup = function(boxText, callbackCancel, callbackConfirm) {

        const dialog = document.createElement("DIALOG");
        dialog.className = "message-box confirm";

        const div = document.createElement("div");

        dialog.appendChild(div);

        const text = document.createElement("p");
        text.textContent = boxText;

        const cancel = document.createElement("button");
        cancel.className = "button";
        cancel.appendChild(document.createTextNode("Cancel"));
        cancel.addEventListener("click", async () => {
            dialog.remove();
            callbackCancel();
        });

        const confirm = document.createElement("button");
        confirm.className = "button";
        confirm.appendChild(document.createTextNode("Confirm"));
        confirm.addEventListener("click", async () => {
            dialog.remove();
            callbackConfirm();
        });
        
        div.appendChild(text);
        div.appendChild(cancel);
        div.appendChild(confirm);

        document.body.appendChild(dialog);
        dialog.show();
    }
    infoPopup = function(boxText="") {
        if (this.infoDialog) {
            this.infoDialog.remove();
            this.infoDialog = null;
            return;
        }

        this.infoDialog = document.createElement("DIALOG");
        this.infoDialog.className = "message-box confirm";

        const div = document.createElement("div");

        this.infoDialog.appendChild(div);

        const text = document.createElement("p");
        text.textContent = boxText;

        document.body.appendChild(this.infoDialog);
        this.infoDialog.show();
    }
    switchTab = function(tab) {
        document.getElementsByClassName("und-select")[0].classList.remove("und-select");
        tab.classList.add("und-select");
    };
    getIcons = function(mods) {
        if (this.iconMap) return this.iconMap;
        const polyVersion = this.gameVersion;
        this.iconMap = {};
    
        for (const [modId, modInfo] of Object.entries(mods)) {
            const latest = modInfo.latest;
            if (!latest) {
                console.warn(`No latest info for mod ${modId}`);
                continue;
            }
            let version = latest[polyVersion];
            if (!version) {
                console.warn(`No version found for polyVersion ${polyVersion} in mod ${modId}`);
                version = latest[Object.keys(latest)[Object.keys(latest).length - 1]];
            }
    
           
            const baseUrl = modInfo.baseUrl;
            const iconUrl = `${baseUrl}/${version}/icon.png`;
    
    
            const img = document.createElement("img");
            img.src = iconUrl;
            img.style.height = "150px";
    
            this.iconMap[modId] = img;
        }
    
        return this.iconMap;
    };
    getDependencies = async function(modId, modurl, modversion, autoUpd=false) {
        
        try {
            const resp = await fetch(modurl + "/" + modversion + "/manifest.json");
            if (!resp.ok) throw new Error(`Failed to fetch manifest for ${mod.url}`);
            
            const data = await resp.json();
            
            if (Array.isArray(data.dependencies) && !(data.dependencies.length === 0)) {
                const confirm = async () => {
                    
                    document.getElementById("mod-div").remove();
                    document.getElementById("library-div").remove();

                    
                    data.dependencies.forEach(async (dep) => {
                        if (!window.ActivePolyModLoader.getMod(dep.id)) {
                            if (this.fullModList[dep.id]) {
                                await this.addMod(this.fullModList[dep.id].url, dep.version, autoUpd);        
                            }
                        }
                        
                    });

                    await this.addMod(modurl, modversion, autoUpd); 
                }

                const importing = [];
                const missing = [];
                
                importing.push(modId + "v" + modversion);
                
                for (const dep of data.dependencies) {
                    if (this.fullModList[dep.id]) {
                        importing.push(dep.id + "v" + dep.version);
                    } else {
                        missing.push(dep.id + "v" + dep.version);
                    }
                }
                
                let message = "";
                
                if (importing.length) {
                    message += `IMPORTING MODS:\n${importing.map(id => `- ${id}`).join("\n")}`;
                }
                
                if (missing.length) {
                    message += `\n\nMISSING MODS:\n${missing.map(id => `- ${id}`).join("\n")}`;
                }

                
                this.confirmPopup(message, () => {}, confirm)
            } else {
                await this.addMod(modurl, modversion, autoUpd);
            }
            
        } catch (error) {
            console.error("Fetch Error:", error.message);
        }  
    }
    addMod = async function(modurl, modversion="latest", autoUpd) {
        if (modurl.endsWith('/')) {
            modurl = modurl.slice(0, -1);
        }
        
        if (modversion === "latest") {autoUpd = true}
        window.ActivePolyModLoader.addMod({ base: modurl, version: modversion, loaded: true }, autoUpd)
        .then(mod => {
            window.ActivePolyModLoader.setModLoaded(mod, true);
            window.ActivePolyModLoader.getMod("pmlcore").createModScreen(this.soundInst);
            this.menuUI();
        })
        .catch(err => {
            console.error(`Failed to import ${modurl}:`, err);
        });
    };
    timeAgo = function(dateStr, modifierStr) {
        const now = new Date();
        const then = new Date(dateStr);
        const seconds = Math.floor((now - then) / 1000);
        const modifier = new String(modifierStr);
    
        const intervals = [
            { label: 'year',   seconds: 31536000 },
            { label: 'month',  seconds: 2592000 },
            { label: 'day',    seconds: 86400 },
            { label: 'hour',   seconds: 3600 },
            { label: 'minute', seconds: 60 }
        ];
    
        for (const i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count >= 1) {
                return `Modified ${count} ${i.label}${count !== 1 ? 's' : ''} ago by ${modifier}`;
            }
        }
    
        return 'Modified just now';
    }
    getHighestVersion = function(latest) {
        const versions = Object.values(latest);
        
        function compareVersions(a, b) {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        const len = Math.max(aParts.length, bParts.length);
        
        for (let i = 0; i < len; i++) {
            const aNum = aParts[i] || 0;
            const bNum = bParts[i] || 0;
            if (aNum > bNum) return 1;
            if (aNum < bNum) return -1;
        }
            return 0; // equal
        }
        
        return versions.reduce((maxVer, curVer) => {
            return compareVersions(curVer, maxVer) > 0 ? curVer : maxVer;
        }, "0.0.0");
    }
    fetchURLS = async function(mods) {
        const entries = Object.entries(mods);
        
        const results = await Promise.all(
            entries.map(async ([modId, mod]) => {
                let description = "No Description Found";
                let latest = null;
                let dependencies = [];
                
                try {
                    const latestResp = await fetch(mod.url + "/latest.json");
                    if (!latestResp.ok) throw new Error(`Failed to fetch ${mod.url}/latest.json`);
                    latest = await latestResp.json();
                } catch (error) {
                    console.error("Fetch Error:", error.message);
                }
                
                try {
                    const polyResp = await fetch(mod.url + "/polylib.json");
                    if (!polyResp.ok) throw new Error(`Failed to fetch ${mod.url}/polylib.json`);
                    const descjson = await polyResp.json();
                    description = descjson.shortdesc ?? description;
                } catch (error) {
                    console.log("Couldn't find polylibrary file in mod:" + mod.name);
                }
                
                return [modId, {
                    latest,
                    shortDesc: description,
                    baseUrl: mod.url,
                    tags: mod.tags || []
                }];
            })
        );
        
        const modsMap = {};
        for (const [modId, modData] of results) {
            modsMap[modId] = modData;
        }
        
        const cache = {
            lastUpdate: new Date().toISOString(),
            mods: modsMap
        };
        
        localStorage.setItem("polylibrary_list_cache", JSON.stringify(cache));
        return cache;
    };

    
    getModList = async function() {
        const modlistUrl = 'https://raw.githubusercontent.com/polytrackmods/PolyLibrary/main/modlist.json';
        
        const modlistResponse = await fetch(modlistUrl);
        if (!modlistResponse.ok) throw new Error("Failed to fetch modlist.json");
        
        const mods = await modlistResponse.json();
    
        return mods;
    }
    getModInfo = async function(mods, refresh=false) {
        let modLatest;
        
        const cacheStr = localStorage.getItem("polylibrary_list_cache");
        
        if (cacheStr && !refresh) {
            const cache = JSON.parse(cacheStr);
            const lastUpdate = new Date(cache.lastUpdate);
            const now = new Date();
            
            const diffMs = now - lastUpdate;
            const oneHourMs = 1000 * 60 * 60;
            
            if (diffMs >= oneHourMs) {
                modLatest = await this.fetchURLS(mods)
            } else {
                modLatest = cache;
          }
        } else {
            modLatest = await this.fetchURLS(mods)
        }
    
        const icons = this.getIcons(modLatest.mods);
    
        const tagSet = new Set();
        Object.values(modLatest.mods).forEach(mod => {
            if (Array.isArray(mod.tags)) {
                mod.tags.forEach(tag => tagSet.add(tag));
            }
        });
    
        let allTags = Array.from(tagSet).sort((a, b) => {
            if (a === "Other") return 1;
            if (b === "Other") return -1;
            return a.localeCompare(b);
        });
    
        this.createTagBar(Array.from(allTags));
        
        Object.entries(mods).forEach(([modId, modInfo]) => {
            this.createModEntry(modId, modInfo.name, modInfo, modLatest, icons);
        });
    };
    createChangelog = async function(thisMod) {
        const url = `${thisMod.baseUrl}/polylib.json`
    
        const loader = document.createElement("p");
        loader.textContent = "Loading Changelogs...";
    
        this.changelog.appendChild(loader);
        this.changelog.scrollTop = "0";
        
        fetch(url)
          .then((res) => {
            if (!res.ok) {throw new Error("Network response was not ok");loader.textContent = "No Changelog Files Found"}
            return res.json();
          })
          .then((data) => {
              
            Object.keys(data.changelogs).forEach(version => {
                const versiondiv = document.createElement("div");
                versiondiv.className = `changelog-entry ${version}`;
                this.changelog.appendChild(versiondiv);
    
                const versionText = document.createElement("p");
                versionText.textContent = `Version: ${version}`;
                versionText.style.padding = "20px 20px 0 20px";
                versionText.style.fontSize = "40px";
                versionText.style.margin = "0";
                
                const logText = document.createElement("p")
                logText.innerHTML = `<ul>${data.changelogs[version].map(item => `<li>${item}</li>`).join("")}</ul>`;
                logText.style.padding = "0 20px 20px 20px";
                logText.style.fontSize = "20px";
                logText.style.margin = "0";
    
                loader.remove();
    
                versiondiv.appendChild(versionText);
                versiondiv.appendChild(logText);
            });
          })
          .catch((err) => {
            loader.textContent = "No Changelog Files Found";
            console.error("Fetch error:", err);
          });
    
        this.changelog.classList.add("created");
    };
    getDescription = async function(modId, thisMod) {
        const version = this.getHighestVersion(thisMod.latest);
        const url = `${thisMod.baseUrl}/${version}/description.html`;
        
        try {
            const res = await fetch(url);
            
            if (res.status !== 200) {
                return "No Description";
            }
            
            const html = await res.text();
            
            
            return html;
            
        } catch (err) {
            console.error("Failed to fetch description:", err);
            return "No Description";
        }
    };
    createVersions = async function (thisMod, modId) {
        this.vers.classList.add("created");
    
        const loader = document.createElement("p");
        loader.textContent = "Loading Version History...";
        this.vers.appendChild(loader);
    
        try {
            const res = await fetch(thisMod.baseUrl);
            if (!res.ok) {
                loader.textContent = "No Versions Found";
                return;
            }
    
            const data = await res.json();
    
            const versionFolders = data
                .filter(item => item.type === "dir")
                .filter(item => /^\d+(\.\d+)*$/.test(item.name))
                .sort((a, b) => {
                    const aParts = a.name.split('.').map(Number);
                    const bParts = b.name.split('.').map(Number);
                    const len = Math.max(aParts.length, bParts.length);
                    for (let i = 0; i < len; i++) {
                        const aVal = aParts[i] ?? 0;
                        const bVal = bParts[i] ?? 0;
                        if (aVal !== bVal) return bVal - aVal;
                    }
                    return 0;
                });
    
            const fragment = document.createDocumentFragment();
    
            const tasks = versionFolders.map(async (e) => {
                const versionName = e.name;
                const lastModified = e.last_modified;
                const modifiedBy = e.last_modified_by || "Unknown";
                const manifestUrl = `${thisMod.baseUrl}/${versionName}/manifest.json`;
    
                try {
                    const res = await fetch(manifestUrl);
                    if (!res.ok) return null;
    
                    const data = await res.json();
    
                    const versiondiv = document.createElement("div");
                    versiondiv.className = `versions-entry ${versionName}`;
    
                    const versionText = document.createElement("p");
                    versionText.textContent = `Version: ${versionName}`;
                    versionText.style.padding = "20px";
                    versionText.style.fontSize = "40px";
                    versionText.style.margin = "0";
                    versionText.style.width = "300px";
    
                    const supportedPolyVersions = document.createElement("p");
                    supportedPolyVersions.style.marginLeft = "50px";
                    supportedPolyVersions.style.width = "100px";
                    supportedPolyVersions.innerHTML = data.polymod.targets.join("<br>");
    
                    const timeStamp = document.createElement("p");
                    timeStamp.style.marginLeft = "100px";
                    timeStamp.textContent = this.timeAgo(lastModified, modifiedBy);
    
                    const addButton = document.createElement("button");
                    addButton.className = "library-add-button button";
                    addButton.innerHTML = `<img src="images/apply.svg"> Add`;
                    addButton.onclick = async () => await this.getDependencies(modId, thisMod.baseUrl, versionName);
                    addButton.style.margin = "20px 20px 20px auto";
                    addButton.style.height = "40px";
                    addButton.style.width = "130px";
                    addButton.style.fontSize = "25px";
    
                    if (window.ActivePolyModLoader.getMod(modId)) {
                        addButton.disabled = true;
                        addButton.style.cursor = "not-allowed";
                    }
    
                    if (
                        !data.polymod.targets.includes(this.gameVersion) ||
                        data.polymod?.locked === true
                    ) {
                        addButton.disabled = true;
                        versiondiv.style.opacity = "0.5";
                        versiondiv.style.background = "black";
                        addButton.style.background = "black";
                        addButton.style.cursor = "not-allowed";
                    }
    
                    versiondiv.appendChild(versionText);
                    versiondiv.appendChild(supportedPolyVersions);
                    versiondiv.appendChild(timeStamp);
                    versiondiv.appendChild(addButton);
    
                    return versiondiv;
                } catch (err) {
                    console.error("Failed to fetch manifest:", err);
                    return null;
                }
            });
    
            const versionDivs = await Promise.all(tasks);
    
            loader.remove();
    
            for (const div of versionDivs) {
                if (div) fragment.appendChild(div);
            }
    
            this.vers.appendChild(fragment);
    
        } catch (err) {
            console.error("Failed to fetch changelog:", err);
        }
    };
    createMutation = function() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    const wasHidden = mutation.oldValue?.includes("hidden");
                    const isNowVisible = !target.classList.contains("hidden");
                    if (wasHidden && isNowVisible) {
                        document.getElementById("poly-library")?.remove();
                        observer.disconnect();
                    }
                }
            }
        });

        const targetElement = document.getElementsByClassName("main-buttons-container")[0];
        observer.observe(targetElement, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    }
    init = (pml) => {  
        pml.getFromPolyTrack(`
            ActivePolyModLoader.getMod("${this.modID}").initMod();
        `);

        this.gameVersion = "0.5.2";
        console.log(this, window.ActivePolyModLoader, window.ActivePolyModLoader.polyVersion);

        let mixinLocation = "mN";
        if (this.gameVersion === "0.5.2") {
            mixinLocation = "mN";
        } else if (this.gameVersion === "0.5.1") {
            mixinLocation = "bN";
        } else {
            mixinLocation = "hD";
        }
        pml.registerFuncMixin(mixinLocation, MixinType.INSERT, 'if (polyMod.id === "pmlcore") {', `
            ActivePolyModLoader.getMod("${this.modID}").soundInst = n;
            ActivePolyModLoader.getMod("${this.modID}").menuUI();
            ActivePolyModLoader.getMod("${this.modID}").createMutation();
        `);
        
    };
}

export let polyMod = new polyLibrary();
