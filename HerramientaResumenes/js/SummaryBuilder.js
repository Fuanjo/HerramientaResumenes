class CabeceraClass{
    static repetibles=false;
    constructor(curso, coletillaAbreviada=""){
        this.curso=curso;
        this.coletillaAbreviada=coletillaAbreviada;
        this.scormTree = document.getElementById('scorm_tree');
        this.scormTreeTitle = document.createElement("div");
        this.scormTreeTitle.className = "scorm_tree_title";
        this.scormTreeTitle.style.cssText = "display: flex; justify-content: center; align-items: center;";
        this.scormTreeTitle.innerHTML = `
            <div class="contenedor"
                style="width: fit-content; padding: 0.5%; padding-right: 1.3%; color: #4376ab; display: flex; flex-direction: row; border: #4376ab 4px solid; border-radius: 20px;">
                <div class="flecha_abajo"
                    style="width: 0; height: 0; margin: 7px 2px 5px 5px; border-radius: 10px; border-left: 25px solid transparent; border-right: 25px solid transparent; border-top: 15px solid #4376AB;">
                </div>
                <span class="treeview-title" style="font-size: 1.5em;">${this.curso}</span>
            </div>`;
        this.cont = document.createElement("div");
        this.cont.id = "cont";
        this.cont.style.cssText = "text-align: start; margin-left: 35%;";

        this.plantillaInfo = document.getElementById('plantilla_infoID');

        //se parar esto en un futuro? e implementar cabeceras repetibles (este fragmento es la unidad actual antes de las tablas)
        this.plantillaInfo.innerHTML = `<div class="contenedor"
        style="width: 100%; color: #4376ab; background-color: #ffffff; display: flex; flex-direction: row; justify-content: center; align-items: stretch; border: #4376ab 4px solid; border-radius: 20px;">
        <div class="cuadro_texto"
            style="flex: 4; padding: 8px; font-weight: bold; font-size: 1.5em; text-align: center;">
                <div id="UnidadAprendizajeActual" style="color: #0079f7;font-size: 1.2em; font-weight: bold;">
                </div>
            </div>
        </div>`;
    }
    toggleRepetibles(){
        this.repetibles=!this.repetibles;
        return this.repetibles;
    }
    getRepetibles(){
        return this.repetibles;
    }
    setUnidades(unidades,numeroUnidades, coletillaAiterar=""){
        if(!Array.isArray(unidades) || unidades.some((elem) => typeof elem !== 'string')){
            return false;
        }
        unidades=reduceArrayToLength(unidades,numeroUnidades);
        this.unidades=unidades;
        this.coletilla=coletillaAiterar;
    }
    getNumUnidades(){
        return this.unidades.length;
    }
    setUnidadActual(num, textoPersonalizado=false){
        this.unidadActual=num;
        this.textoPersonalizado=textoPersonalizado===""?false:textoPersonalizado;
    }
    getUnidadActual(){
        return this.unidadActual;
    }
    setPlantillaInfoPropety(propiedad,valor){
        this.plantillaInfo.style.setProperty(propiedad,valor);
    }
    setScormTreePropety(propiedad,valor){
        this.scormTree.style.setProperty(propiedad,valor);
    }
    setScormTreeTitle(propiedad,valor){
        this.scormTreeTitle.style.setProperty(propiedad,valor);
    }
    setCont(propiedad,valor){
        this.cont.style.setProperty(propiedad,valor);
    }
    fillScormTree() {
        if(!this.repetibles){
            this.scormTree.innerHTML = "";
        }
        this.createTreeItems();
        if(this.unidadActual>0 && this.unidadActual<=this.unidades.length){
            this.plantillaInfo.style.setProperty("display","block");
            this.plantillaInfo.querySelector("#UnidadAprendizajeActual").textContent=(this.coletillaAbreviada!==""?this.coletillaAbreviada+" ":"")+(this.unidadActual)+": "+(this.textoPersonalizado!==false?this.textoPersonalizado:this.unidades[this.unidadActual-1]);
        }else{
            this.plantillaInfo.style.setProperty("display","none");
        }
        if(this.curso!==""){
            this.scormTree.appendChild(this.scormTreeTitle);
        }
        this.scormTree.appendChild(this.cont);
    }
    createTreeItems(color="#0079f7") {
        const treeItemsHtml = [];
        for (let i = 0; i < this.unidades.length; i++) {
            let itemHtml = `<div class="treeitem" style="display: inline-block;">
                <div class="treeview-row">
                    <div class="flecha_derecha"
                        style="width: 0; height: 0; margin: 0px 5px; border-radius: 10px; border-left: 15px solid #4376AB; border-top: 15px solid transparent; border-bottom: 15px solid transparent; display: inline-block; vertical-align: middle;">
                    </div>
                    <span class="treeview-label" style="vertical-align: middle;`+ ((i === this.unidadActual-1) ? (`color:` + color + `; font-weight: bold;`) : (``)) + `font-size: 1.3em;">${this.coletilla!==""?this.coletilla+" "+(i+1)+" : ":""}${this.unidades[i]}</span>
                </div>
            </div>`;
            treeItemsHtml.push(itemHtml);
        }
        treeItemsHtml.forEach(item => {
            this.cont.insertAdjacentHTML('beforeend', `<div style="margin: 5px 0px;"></div>`);
            this.cont.insertAdjacentHTML('beforeend', item);
        });
    }
}
class BloquesFlechaClass{
    /**
     * Constructor de BloquesFlechaClass
     * @param {number} num - N mero de bloque
     * @param {boolean} ultimaFlecha - Si es la  ultima flecha o no
     */
    constructor(num,ultimaFlecha=false){
        this.bloqueFlecha = document.createElement("div");
        this.bloqueFlecha.id = "bloque_flecha_" + num;
        this.bloqueFlecha.style.cssText = `width: 80%; position: relative; ` +
            `left: 10%; ` +
            `flex: 1; ` +
            `display: flex; ` +
            `flex-direction: column; ` +
            `align-items: center;`
            ;
        this.cola = document.createElement("div");
        this.cola.className = "cola";
        this.cola.style.cssText = `height: 20px;` +
            "width: 0px;" +
            "z-index: -1;" +
            `border-right-width: 50px;`+
            `border-right-style: solid;` +
            `border-left-width: 50px;` + 
            `border-left-style: solid;` +
            "border-top-width: 25px;"+
            "border-top-style: solid;"; 
        if (!ultimaFlecha) {
            this.ultimaFlecha = false;
            this.curpo = document.createElement("div");
            this.curpo.className = "curpo";
            this.curpo.style.cssText = "width: 100px;" +
                "height: 20px;" +
                "z-index: -1;";
            this.punta = document.createElement("div");
            this.punta.className = "punta";
            this.punta.style.cssText = "width: 0px;" +
                "height: 0px;" +
                "z-index: -1;" +
                `border-right-width: 85px;` +
                `border-right-style: solid;`+
                `border-left-width: 85px;` +
                `border-left-style: solid;` +	
                `border-top-width: 25px;`+
                `border-top-style: solid;`;
        }else{
            this.ultimaFlecha = true;
            // this.curpo = false;
            // this.punta=false;
        }
    }
    /**
     * Setea una propiedad CSS del bloque de la flecha.
     * @param {string} propiedad - La propiedad CSS a setear.
     * @param {string} valor - El valor de la propiedad CSS a setear.
     */
    setBloqueFlechaProperty(propiedad, valor){
        this.bloqueFlecha.style.setProperty(propiedad, valor);
    }    
    /** 
     * Establece el color de la flecha.
     *  V Tiene hueco.
     *  | No tiene hueco.
     *  V Tiene hueco.
     * @param {string} color - El color del bloque de la flecha.
     * @param {string} colorHueco - El color del hueco de la flecha.
     */
    setFlechaColor(color,colorHueco){
        this.setColaColor(color,colorHueco);
        this.setCurpoColor(color);
        this.setPuntaColor(color,colorHueco);
    }
    /**
     * Establece el color de la cola de la flecha.
     * @param {string} color - El color del borde derecho e izquierdo de la cola.
     * @param {string} colorHueco - El color del borde superior de la cola.
     */
    setColaColor(color,colorHueco){
        this.setColaColorPartes(color,color,colorHueco);
    }
    /**
     * Sets the color of the arrowhead.
     * The color and colorHueco determine the visual appearance of the arrowhead's borders.
     * 
     * @param {string} color - The color for the top border of the arrowhead.
     * @param {string} colorHueco - The color for the right and left borders of the arrowhead.
     */
    setPuntaColor(color, colorHueco){
        this.setPuntaColorPartes(colorHueco,colorHueco,color);
    }
    /**
     * Sets the border colors of the arrow's tail parts.
     * 
     * @param {string|boolean} colorRight - The color for the right border of the tail. If false, no change is made.
     * @param {string|boolean} colorLeft - The color for the left border of the tail. If false, no change is made.
     * @param {string|boolean} colorTop - The color for the top border of the tail. If false, no change is made.
     */
    setColaColorPartes(colorRight=false,colorLeft=false,colorTop=false){
        if(colorRight!==false)this.cola.style.borderRightColor = colorRight;
        if(colorLeft!==false)this.cola.style.borderLeftColor = colorLeft;
        if(colorTop!==false)this.cola.style.borderTopColor = colorTop;
    }
    /**
     * Sets the background color of the arrow's body (the middle part of the arrow).
     * This only applies if the arrow is not the last one in the sequence.
     * 
     * @param {string} color - The color to set for the background of the body.
     */
    setCurpoColor(color){
        if(!this.ultimaFlecha){
            this.curpo.style.backgroundColor = color;
        }
    }
    /**
     * Sets the border colors of the arrowhead parts.
     * 
     * @param {string|boolean} colorRight - The color for the right border of the arrowhead. If false, no change is made.
     * @param {string|boolean} colorLeft - The color for the left border of the arrowhead. If false, no change is made.
     * @param {string|boolean} colorTop - The color for the top border of the arrowhead. If false, no change is made.
     */
    setPuntaColorPartes(colorRight=false,colorLeft=false,colorTop=false){
        if(!this.ultimaFlecha){
            if(colorRight!==false)this.punta.style.borderRightColor = colorRight;
            if(colorLeft!==false)this.punta.style.borderLeftColor = colorLeft;
            if(colorTop!==false)this.punta.style.borderTopColor = colorTop;
        }
    }
/**
 * Constructs and appends a block element containing the arrow parts and the provided table.
 * 
 * If the table is not null, it appends the tail (cola) and the table to the main arrow block (bloqueFlecha).
 * If the arrow is not the last in sequence, it also appends the body (curpo) and the head (punta).
 * Finally, it appends the entire arrow block to the element with the id "todas_tablas".
 * 
 * @param {HTMLTableElement|null} tabla - The table element to include in the arrow block. If null, no action is taken.
 */
    buildBloque(tabla){
        if(tabla!==null){
            this.bloqueFlecha.appendChild(this.cola);
            this.bloqueFlecha.appendChild(tabla);
            if(!this.ultimaFlecha){
                this.bloqueFlecha.appendChild(this.curpo);
                this.bloqueFlecha.appendChild(this.punta);
            }
            document.getElementById("todas_tablas").appendChild(this.bloqueFlecha); 
        }
    }
}
class TablasClass{
    constructor(colorTabla,titulo=false){
        this.tablaContenidos = document.createElement("div");
        this.tablaContenidos.className = "tabla_contenidos";
        this.tablaContenidos.style.cssText = "width: 100%;" +
            "font-weight: bold;" +
            "border-width: 1px;"+
            "border-style: solid;" +
            "border-color: "+colorTabla+";" +
            "padding: 2px;" +
            "border-radius: 10px;" +
            "min-width: 25%;" +
            "max-width: 150%";
        this.titulo=titulo;
        this.tituloName=titulo;
        if(this.titulo!==false){
            this.titulo = document.createElement("div");
            this.titulo.className = "titulo";
            this.titulo.style.cssText = "text-align: center;" +
                "background-color: " + colorTabla + ";" +
                "color: #ffffff;" +
                "border-radius: 10px 10px 5px 5px;" +
                "padding: 4px 0px;";
                this.titulo.textContent = this.tituloName;
            this.tablaContenidos.appendChild(this.titulo);
        }
        this.tableContentInOrder=[];
    }
    setTablaContenidosPropety(propiedad,valor){
        this.tablaContenidos.style.setProperty(propiedad,valor);
    }
    setTituloPropety(propiedad,valor){
        if(this.titulo!==false){
            this.titulo.style.setProperty(propiedad,valor);
        }
    }
    setSubtitulo(subtitulo, subtituloId, colorSubtitulo,style=false){
        if(subtitulo!=='' && subtituloId!==''){
            const subtituloDiv = document.createElement("div");
            subtituloDiv.className = "subtitulo";
            subtituloDiv.id = subtituloId;
            subtituloDiv.style.cssText = "text-align: center;" +
                "background-color: " + colorSubtitulo + ";" +
                "padding: 4px 10px;" +
                "border-radius: 5px 5px 10px 10px;" +
                "margin-top: 2px;";
            if(style!==false){
                subtituloDiv.style.cssText+=style;
            }
            subtituloDiv.textContent = subtitulo;
            this.tableContentInOrder.push(subtituloDiv);
        }
    }
    setColumnasPorListas(columnsContainer){
        if(columnsContainer instanceof HTMLElement){
            this.tableContentInOrder.push(columnsContainer);
            return true;
        }
        return false;
    }
    getTableContents(){
        return this.tableContentInOrder;
    }
    buildTabla(){
        let contenidosLen=this.tableContentInOrder.length;
        for(let i=0;i<contenidosLen;i++){
            let radiusBottom=contenidosLen-1===i?"10px":"5px";
            let radiusTop=this.titulo===false&&i===0?"10px":"5px";
            if(this.tableContentInOrder[i] instanceof HTMLElement){
                if(this.tableContentInOrder[i].querySelectorAll(".column").length>0){//esto podria ser un callback
                    let columns=this.tableContentInOrder[i].getElementsByClassName("column");
                    if(columns.length>1){
                        for (let j = 0; j < columns.length; j++) {
                            let column = columns[j];
                            if(j===columns.length-1){
                                column.style.setProperty("border-radius",
                                    radiusTop+" "+
                                    "5px "+
                                    radiusBottom+" "+
                                    "5px"
                                );
                            }
                            if(j===0){
                                column.style.setProperty("border-radius",
                                    "5px "+radiusTop+" "+
                                    "5px "+
                                    radiusBottom
                                );
                            }
                            if(j>0&&j<columns.length-1){
                                column.style.setProperty("border-radius","5px 5px 5px 5px");
                            }
                        }
                    }else{
                        columns[0].style.setProperty("border-radius",radiusTop+" "+radiusTop+" "+radiusBottom+" "+radiusBottom);
                    }
                }else{
                    this.tableContentInOrder[i].style.setProperty("border-radius",radiusTop+" "+radiusTop+" "+radiusBottom+" "+radiusBottom);
                }
                this.tablaContenidos.appendChild(this.tableContentInOrder[i]);
            }
        }
    }

    getTablaContenidos(){
        return this.tablaContenidos;
    }
}
class ColumnsContainersClass{
    constructor(containerClass,maxElementos, maxColumnas, minColumnas=0){
        this.contenedor = document.createElement("div");
        this.contenedor.className = containerClass;
        this.contenedor.style.cssText = "flex:1;" +
            "display:flex;" +
            "flex-direction:row;" +
            "justify-content:center;" +
            "align-items:stretch;" +
            "margin:2px 0px 0px 0px";
        this.maxElementos=maxElementos;
        this.maxColumnas=maxColumnas;
        this.minColumnas=minColumnas;
        this.color="default";
        this.columnas=[];
    }
    setColumnsColor(color){
        this.color=color;
    }
    getContainer(){
        return this.contenedor;
    }
    static calculateColumns(maxElements, maxColumns, minColumns, actualElements) {
        let optElementsPerColumn=0;
        let optColumns=0;
        if(actualElements>0){
            optColumns = Math.min(maxColumns, Math.ceil(actualElements / maxElements));
            optColumns = Math.max(minColumns, optColumns);
            optElementsPerColumn = Math.ceil(actualElements / optColumns);
        }
        return [ optColumns, optElementsPerColumn ];
    }
    buildContainer(ulId,arrayColumnas=false){
        if(arrayColumnas!==false){
            if(arrayColumnas.length>0){
                let columLen=arrayColumnas.length;
                columLen=(columLen==1?(arrayColumnas[0]==''?0:1):columLen);
                let [columnCount,elementsPerColumn]=ColumnsContainersClass.calculateColumns(this.maxElementos, this.maxColumnas, this.minColumnas, columLen);
                this.elementsPerColumn=elementsPerColumn;
                this.columnCount=columnCount;
                let indexLi = 0;
                if (this.columnCount > 0) {
                    for (let i = 0; i < this.columnCount; i++) {

                        let end = indexLi + this.elementsPerColumn;
                        if (end > columLen) {
                            end = columLen;
                        }
                        let textos = arrayColumnas.slice(indexLi, end);
                        let column=new ColumnsClass(textos,"-");
                        column.setColumnStyle("background-color",this.color);
                        indexLi = end;
                        this.columnas.push(column);
                        this.contenedor.appendChild(column.getColumn());
                    }
                    return true;
                }
            }
        }else{
            const myList = readUl(ulId);            
            if(myList!==null){
                let myListLen = myList.length;   
                myListLen=(myListLen==1?(myList[0]==''?0:1):myListLen);
                let [columnCount,elementsPerColumn]=ColumnsContainersClass.calculateColumns(this.maxElementos, this.maxColumnas, this.minColumnas, myListLen);
                this.elementsPerColumn=elementsPerColumn;
                this.columnCount=columnCount;
                let indexLi = 0;
                if (this.columnCount > 0) {
                    for (let i = 0; i < this.columnCount; i++) {

                        let end = indexLi + this.elementsPerColumn;
                        if (end > myListLen) {
                            end = myListLen;
                        }
                        let textos = myList.slice(indexLi, end);
                        let column=new ColumnsClass(textos,"-");
                        column.setColumnStyle("background-color",this.color);
                        indexLi = end;
                        this.columnas.push(column);
                        this.contenedor.appendChild(column.getColumn());
                    }
                    return true;
                }
            }
        }
        return false;
    }
    iterarColumnas(callback){
        if(typeof callback === "function"){
            for(let i=0;i<this.columnas.length;i++){
                callback(this.columnas[i]);
            }
        }
    }
    setAllColumnsPropety(propiedad, valor){
        this.iterarColumnas((columnaObject)=>{
            columnaObject.setColumnStyle(propiedad,valor);
        })
    }
    setAllCuadrosPropety(propiedad, valor){
        this.iterarCuadroas((columnaObject)=>{
            columnaObject.setCuadroStyle(propiedad,valor);
        })
    }
    setAllUlsPropety(propiedad, valor){
        this.iterarUlas((columnaObject)=>{
            columnaObject.setUlStyle(propiedad,valor);
        })
    }
}
class ColumnsClass{
    constructor(elementos, elementText){
        this.column = document.createElement('div');
        this.column.className = 'column';
        this.column.style.cssText = "flex:1;" +
            "display:flex;" +
            "flex-direction:column;" +
            "align-items:stretch;" +
            "border-radius: 5px 5px 10px 10px;" +
            "margin:0px 1px 0px 0px";

        this.cuadro = document.createElement('div');
        this.cuadro.className = 'cuadro';
        this.cuadro.style.cssText = "flex:1;" +
            "padding: 5px;" +
            "margin: 2px 0px 0px 0px;" +
            "text-align:center;";
        this.column.appendChild(this.cuadro);
        this.elementos=elementos;
        this.ul = createUl(elementos,"",(li,index)=>{
            if ((typeof li === 'object' && li.tagName === 'LI')) {
                li.textContent = elementText+" "+li.textContent;
            } else {
                li = elementText+" "+li;
            }
            return li;
        });
        this.ul.style.cssText = "padding: 0px 20px;" +
            "margin: 0px;" +
            "list-style: none;";
        this.cuadro.appendChild(this.ul);
    }
    setColumnStyle(propiedad, valor){
        this.column.style.setProperty(propiedad, valor);
    }    
    setCuadroStyle(propiedad, valor){
        this.cuadro.style.setProperty(propiedad, valor);
    }
    setUlStyle(propiedad, valor){
        this.ul.style.setProperty(propiedad, valor);
    }
    getColumn(){
        return this.column;
    }
}
/**
 * Creates or updates an unordered list (ul) element with the specified ID.
 * Appends list items (li) to the ul based on the provided liValueList.
 * If a list item is an object with a tagName of 'LI' or a string formatted as an HTML li element,
 * it is directly appended. Otherwise, a new li element is created with the text content.
 * An optional callback can be provided to manipulate each li element before appending.
 *
 * @param {string} idUl - The ID of the unordered list to create or update.
 * @param {Array.<(string|HTMLElement)>} liValueList - An array of strings, li elements, or li HTML strings to be added as list items.
 * @param {function} [callback=false] - An optional function to be called with each li element before appending.
 * @returns {HTMLElement} - The ul element after appending the list items.
 */
function createUl(liValueList, idUl = "", callback = false) {
    let ul = document.getElementById(idUl);
    if (!ul) {
        ul = document.createElement('ul');
        ul.id = idUl;
    }

    if (Array.isArray(liValueList)) {
        liValueList.forEach((value, index) => {
            let li;
            if ((typeof value === 'object' && value.tagName === 'LI') || (value.startsWith('<li>') && value.endsWith('</li>'))) {
                li = value;
            } else {
                li = document.createElement('li');
                li.textContent = value;
            }

            if (callback && typeof callback === 'function') {
                callback(li, index);
            }

            ul.appendChild(li);
        });
    }

    return ul;
}


/**
 * Reads the content of an unordered list (ul) element with the specified ID.
 * Returns an array of strings (text content of each list item), an array of HTML li elements, or the result of a callback function.
 *
 * @param {string} idUl - The ID of the unordered list to read.
 * @param {function|boolean} [callback=false] - An optional function to be called with the ul element as an argument.
 *                                             If true, an array of HTML li elements will be returned.
 *                                             If a function, its return value will be returned.
 *                                             If not provided or false, an array of strings (text content of each list item) will be returned.
 * @returns {(string[]|HTMLLIElement[]|*)} - The content of the unordered list as an array of strings, an array of HTML li elements, or the result of a callback function.
 */
function readUl3(idUl, callback = false) {
    const ul = document.getElementById(idUl);
    if (!ul) return null;

    if (callback === true) {
        return Array.from(ul.children);
    } else if (typeof callback === 'function') {
        return callback(ul);
    } else {
        return Array.from(ul.children).map(li => {
            const textContent = li.textContent;
            const innerUl = li.querySelector('ul');
            if (innerUl) {
                return textContent + ':\n\n' + Array.from(innerUl.children).map(innerLi => '    ' + innerLi.textContent).join('\n');
            }
            return textContent;
        });
    }
}



function readUl(idUl, callback = false) {
    const ul = document.getElementById(idUl);
    if (!ul) return null;

    if (callback === true) {
        return Array.from(ul.children);
    } else if (typeof callback === 'function') {
        return callback(ul);
    } else {
        return Array.from(ul.children).map(li => li.textContent);
    }
}

/**
 * Reduces an array of strings to a specified length by adding strings to the end of the array
 * until the specified length is reached.
 * If the array is already longer than the specified length, the extra elements are ignored.
 * When inputLength < 1 it returns an empty array
 * @param {Array<string>} arrayOfStrings - The array of strings to reduce.
 * @param {number} inputLength - The length to reduce to.
 * @returns {Array<string>} - The reduced array of strings.
 */
function reduceArrayToLength(arrayOfStrings, inputLength) {
    return arrayOfStrings.reduce((accumulator, currentValue) => {
        if (accumulator.length < inputLength) {
            accumulator.push(currentValue);
        }
        return accumulator;
    }, []);
}


/**
 * Returns a random number between 0 (inclusive) and the given range (exclusive)
 * @param {number} range - The maximum number that can be returned
 * @return {number} The random number
 */
function getRandom(range){
    return Math.floor(Math.random()*range);
}