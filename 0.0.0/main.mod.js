import { PolyMod, MixinType } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";

class polyLibrary extends PolyMod {

    listDiv;
    tagDiv;
    loader;
    apml;
    soundInst;
    tagButtons = [];
    
    createUI = function() {
        const uistyle = document.createElement("style");
        uistyle.textContent = `
        .mod-library {
            position: absolute;
            top: 0;
            left: 0;
            background-color: #28346a;
            width: 200px;
            height: 100px;
            align-content: end;
            text-align: center;
            pointer-events: auto;
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
            gap: 40px;
            display: flex;
            flex-direction: row;
        }
        .library-back-button {
            margin: 10px;
            padding: 10px 20px;
            float: left;
        }
        .library-add-button {
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
        .tag-box {
            height: 100%;
            width: 100px;
            clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
            display: flex;
            align-items: center;
            background: #112052;
            justify-content: center;
            padding: 0 70px;
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
            display: flex;
            flex-direction: row;
            padding: 20px;
            text-align: left;
            gap: 20px;
            margin-bottom: auto;
            align-items: end;
        }
        .select-tag {
            background: #334b77;
        }
        `;
        
        document.head.appendChild(uistyle);
        
        const uiDiv = document.getElementById("ui");
        if (!uiDiv) return;
        
        const baseDiv = document.createElement("div");
        baseDiv.className = "mod-library";
        
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
    };


    libraryUI = async function(uiDiv) {
        
        const baseDiv = document.createElement("div");
        baseDiv.className = "library-div";

        uiDiv.appendChild(baseDiv);

        const topText = document.createElement("h2");
        topText.textContent = "Mod Library";
        topText.className = "top-text";

        baseDiv.appendChild(topText);

        this.tagDiv = document.createElement("div");
        this.tagDiv.className = "tag-div";

        baseDiv.appendChild(this.tagDiv);

        this.listDiv = document.createElement("div");
        this.listDiv.className = "library-list"

        baseDiv.appendChild(this.listDiv);

        const bottomDiv = document.createElement("div");
        bottomDiv.className = "bottom-bar";
        bottomDiv.style.marginTop = "auto";

        baseDiv.appendChild(bottomDiv)
        
        const backButton = document.createElement("button");
        backButton.className =  "library-back-button button";
        backButton.innerHTML = `<img src="images/back.svg"> Back`;
        backButton.onclick = () => {
            baseDiv.remove();
            this.apml.getMod("pmlcore").createModScreen(this.soundInst);
            this.createUI();
        };

        bottomDiv.appendChild(backButton);

        const addButton = document.createElement("button");
        addButton.className =  "library-add-button button";
        addButton.innerHTML = `<img src="images/import.svg"> Refresh`;
        addButton.onclick = async () => {
            this.listDiv.innerHTML = '';

            this.loader = document.createElement("p");
            this.loader.textContent = "Loading Library...";
            this.loader.id = "library-load";
    
            this.listDiv.appendChild(this.loader);

            await this.getLibrary(true);
        };

        bottomDiv.appendChild(addButton);

        this.loader = document.createElement("p");
        this.loader.textContent = "Loading Library...";
        this.loader.id = "library-load";

        this.listDiv.appendChild(this.loader);

        await this.getLibrary();
    };

    createTags = function(tagList) {
        const allTagBox = document.createElement("button");
        allTagBox.textContent = "All";
        allTagBox.className = "tag-box button select-tag";
        allTagBox.onclick = () => {
            for (const child of this.listDiv.children) {
                child.style.display = "flex";
            };
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

    getLibrary = async function(bypass=false) {
        const modlistUrl = 'https://raw.githubusercontent.com/polytrackmods/PolyLibrary/main/modlist.json';
        
        const modlistResponse = await fetch(modlistUrl);
        if (!modlistResponse.ok) throw new Error("Failed to fetch modlist.json");
        
        const mods = await modlistResponse.json();

        await this.getModInfo(mods, bypass);
    };

    createModEntry = function(modId, modName, modAuthor, modIcon, modVersions, tags) {
        const entry = document.createElement("div");
        entry.className = `library-entry button ${tags.join(" ")}`;

        this.listDiv.appendChild(entry)

        entry.appendChild(modIcon);

        const bigDiv = document.createElement("div");
        bigDiv.className = "content-div";
        bigDiv.style.textAlign = "left";

        entry.appendChild(bigDiv)

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

    fetchURLS = async function(mods) {
        const entries = Object.entries(mods);
    
        const results = await Promise.all(
            entries.map(async ([modId, mod]) => {
                const url = mod.url + "/latest.json";
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Failed to fetch ${url}`);
                const latest = await res.json();
    
                return [modId, {
                    latest,
                    website: mod.url.includes("pml.crjakob.com")
                        ? "codeberg"
                        : mod.url.includes("raw.githubusercontent.com")
                        ? "github"
                        : "unknown",
                    baseUrl: mod.url,
                    tags: mod.tags || []
                }];
            })
        );
    
        const modsMap = {};
        for (const [modId, modData] of results) {
            modsMap[modId] = modData;
        }
    
        // Compose the final cached object
        const cache = {
            lastUpdate: new Date().toISOString(),
            mods: modsMap
        };
    
        localStorage.setItem("polylibrary_list_cache", JSON.stringify(cache));
        return cache;
    };

    getIcons = function(mods) {
        const polyVersion = this.polyVersion[0];
        const iconMap = {};

    
        for (const [modId, modInfo] of Object.entries(mods)) {
            const latest = modInfo.latest;
            if (!latest) {
                console.warn(`No latest info for mod ${modId}`);
                continue;
            }
            const version = latest[polyVersion];
            if (!version) {
                console.warn(`No version found for polyVersion ${polyVersion} in mod ${modId}`);
                continue;
            }
    
           
            const baseUrl = modInfo.baseUrl;
            const iconUrl = `${baseUrl}/${version}/icon.png`;
    
    
            const img = document.createElement("img");
            img.src = iconUrl;
            img.style.height = "150px";
    
            iconMap[modId] = img;
        }
    
        return iconMap;
    };


    getModInfo = async function(mods, bypass=false) {
        let modlatest;
        if (bypass) {
            modlatest = await this.fetchURLS(mods)

            const icons = this.getIcons(modlatest.mods);

            this.loader.remove(this.loader);
            
            Object.entries(mods).forEach(([modId, modInfo]) => {
                this.createModEntry(modId, modInfo.name, modInfo.author, icons[modId], modlatest.mods[modId].latest, modlatest.mods[modId].tags);
                console.log(`Mod ID: ${modId}`);
            });

            return;
        }
        const cacheStr = localStorage.getItem("polylibrary_list_cache");
        if (cacheStr) {
          const cache = JSON.parse(cacheStr);
          const lastUpdate = new Date(cache.lastUpdate);
          const now = new Date();
        
          const diffMs = now - lastUpdate;
          const oneHourMs = 1000 * 60 * 60;
        
          if (diffMs >= oneHourMs) {
            modlatest = await this.fetchURLS(mods)
          } else {
            modlatest = cache;
          }
        } else {
          modlatest = await this.fetchURLS(mods)
        }

        const icons = this.getIcons(modlatest.mods);

        const tagSet = new Set();
        Object.values(modlatest.mods).forEach(mod => {
            if (Array.isArray(mod.tags)) {
                mod.tags.forEach(tag => tagSet.add(tag));
            }
        });

        let allTags = Array.from(tagSet).sort((a, b) => {
            if (a === "Other") return 1;
            if (b === "Other") return -1;
            return a.localeCompare(b);
        });

        this.createTags(Array.from(allTags));

        this.loader.remove(this.loader);
        
        Object.entries(mods).forEach(([modId, modInfo]) => {
            this.createModEntry(modId, modInfo.name, modInfo.author, icons[modId], modlatest.mods[modId].latest, modlatest.mods[modId].tags);
            console.log(`Mod ID: ${modId}`);
        });

        

    };

    init = (pml) => {    
        pml.registerFuncMixin("hD", MixinType.INSERT, 'if (polyMod.id === "pmlcore") {', `ActivePolyModLoader.getMod("${this.modID}").soundInst = n;ActivePolyModLoader.getMod("${this.modID}").apml = ActivePolyModLoader;ActivePolyModLoader.getMod("${this.modID}").createUI();`);
    };
}
export let polyMod = new polyLibrary();
