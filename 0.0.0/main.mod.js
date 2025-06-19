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
                libraryOpenButton.className = "library-open-button"
                libraryOpenButton.textContent = "Open";  
                libraryOpenButton.onclick = () => {
                    document.getElementsByClassName("track-info")[0]
                };
                
                baseDiv.appendChild(libraryOpenButton);
        };

        init = (pml) => {    
                pml.registerFuncMixin("hD", MixinType.INSERT, 'if (polyMod.id === "pmlcore") {', `ActivePolyModLoader.getMod(${this.modID}).createUI();`);
    }
}
export let polyMod = new polyLibrary();
