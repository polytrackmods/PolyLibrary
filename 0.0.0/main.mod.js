import { PolyMod, MixinType } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";

class polyLibrary extends PolyMod {

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
            flex-grow: 1;
            background-color: #212b58;
            overflow-x: hidden;
            overflow-y: scroll;
            pointer-events: auto;
        }
        .tag-box {
            height: 75%;
            width: 100px;
            clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
            display: flex;
            align-items: center;
            background: #112052;
            justify-content: center;
            padding: 0 70px;
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

    libraryUI = function(uiDiv) {
        const baseDiv = document.createElement("div");
        baseDiv.className = "library-div";

        uiDiv.appendChild(baseDiv);

        const topText = document.createElement("h2");
        topText.textContent = "Mod Library";
        topText.className = "top-text";

        baseDiv.appendChild(topText);

        const tagDiv = document.createElement("div");
        tagDiv.className = "tag-div";

        baseDiv.appendChild(tagDiv);

        const listDiv = document.createElement("div");
        listDiv.className = "library-list"

        baseDiv.appendChild(listDiv);

        const bottomDiv = document.createElement("div");
        bottomDiv.className = "bottom-bar";
        bottomDiv.style.marginTop = "auto";

        baseDiv.appendChild(bottomDiv)
        
        const backButton = document.createElement("button");
        backButton.className =  "library-back-button button";
        backButton.innerHTML = `<img src="images/back.svg"> Back`;

        bottomDiv.appendChild(backButton);

        const addButton = document.createElement("button");
        addButton.className =  "library-add-button button";
        addButton.innerHTML = `<img src="images/checkmark.svg"> Add`;

        bottomDiv.appendChild(addButton);

        const library = this.getLibrary();

        const allTagBox = document.createElement("button");
        allTagBox.textContent = "All";
        allTagBox.className = "tag-box button";
        tagDiv.appendChild(allTagBox);
        
        for (const tag of library.tags) {
            const tagBox = document.createElement("button");
            tagBox.textContent = tag;
            tagBox.className = "tag-box button";

            tagDiv.appendChild(tagBox);
        }
    };

    getLibrary = function() {
        return {
            tags: ["Editor", "Car", "UI"],
            mods: []
        }
    }

    init = (pml) => {    
        pml.registerFuncMixin("hD", MixinType.INSERT, 'if (polyMod.id === "pmlcore") {', `ActivePolyModLoader.getMod("${this.modID}").createUI();`);
    }
}
export let polyMod = new polyLibrary();
