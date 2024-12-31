class ElementsClass{
    constructor(id, type, create=false){
        this.element=document.getElementById(id);
        if (!this.element && create) {
            this.element = document.createElement(typeof type === 'string' ? type === '' ? 'div' : type : 'div');
            this.element.id = id;
        }
    }
    addClasses(classes){
        this.element.classList.add(...classes);
    }
    getElement(){
        return this.element;
    }
    doOperations(callback){
        callback(this.element);
    }
    getElementId(){
        return this.element.id;
    }
    getValue(){
        return this.element.value;
    }
    setValue(value){
        this.element.value=value;
    }
}
class EnlacesClass{
    constructor(elementos=[]){
        this.enlace=elementos;
    }
    getObjectByIndex(indexObjeto){
        return this.enlace[indexObjeto];
    }
    getObjectById(id){
        return this.enlace.find(objeto=>objeto.getElementId()==id);
    }
    getLength(){
        return this.enlace.length;
    }
    doOperationsOnEnlace(callback,indexes=0){
        if(indexes.length>1){
            callback(...indexes.map(index=>(this.enlace[index])));
        }else if(indexes.length==1){
            callback(this.enlace[indexes[0]]);
        }else if(indexes.length==0){
            callback(this.enlace);
        }
    }
    setObjeto(elemento){
        this.enlace.push(elemento);
    }
}
class TablaConfClass extends ElementsClass{
    constructor(apendiceID){
        super("form_tabla_"+apendiceID,"div", true);
        this.apendiceID=apendiceID;
        this.enlazarCalled = false;
        this.element.classList.add(...['flexColumn', 'center', 'flexDisplay','formularios']);
        this.element.innerHTML=`
        <div class="flexDisplay center flexColumn"> 
            <span class="resaltar">Tabla ${this.apendiceID}</span>
            <div class="flexDisplay center flexRow">
                <div class="flexDisplay center flexColumn">
                    <label for="forzarTitulo_${this.apendiceID}">Forzar Titulo:</label>
                    <input class="lineaTexto" type="text" id="forzarTitulo_${this.apendiceID}" name="forzarTitulo_name_${this.apendiceID}" placeholder="Especifico o unico">
                    <div class="flexDisplay center flexRow">
                        <input type="checkbox" id="ocultarTitulo_${this.apendiceID}" name="ocultarTitulo_name_${this.apendiceID}">
                        <label for="ocultarTitulo_${this.apendiceID}">Ocultar Titulo.</label>
                    </div>
                </div>                
                <div class="flexDisplay center flexColumn">
                    <span>Subtitulos (opcional):</span>
                    <textarea class="textarea" id="subtitulos_${this.apendiceID}" name="subtitulos_name_${this.apendiceID}" rows="5" cols="25" placeholder="Subtitulos"></textarea>
                </div>
                <div class="flexDisplay center flexColumn"> 
                    <span>Anidación:</span>
                    <div class="ElSlider"><div id="sliderAnidacion_${this.apendiceID}"></div></div>
                </div>    
            </div>
        </div>
        <div class="flexDisplay center flexColumn" id="listaSubtitulos_${this.apendiceID}">
        </div>
        `;
        this.max = 12;
        this.min = 0;
    }
    enlazar(){    
        if(!this.enlazarCalled){  
            this.subtitulosTextArea=new TextAreasClass("subtitulos_"+this.apendiceID);
            this.sliderAnidacion = new SlidersClass('sliderAnidacion_'+this.apendiceID,this.min,this.max,[this.min]);

            this.forzarTitulo=document.getElementById("forzarTitulo_"+this.apendiceID);
            this.ocultarTitulo=document.getElementById("ocultarTitulo_"+this.apendiceID);


            this.subtitulosList=this.subtitulosTextArea.extractRows();
            this.listaSubtitulos = document.getElementById('listaSubtitulos_'+this.apendiceID);
            this.listaSubtitulosArray = [];
            for (let i = 0; i <= this.max; i++) {
                let e=i+1;
                if(e<=this.max){
                    this.listaSubtitulosArray.push(new SubtitulosClass(this.apendiceID+"_"+e,this.subtitulosList!==false?this.subtitulosList[i]:false));
                }
            }
            this.subtitulosTextArea.getElement().addEventListener('paste', (e) => {
                const pastedText = e.clipboardData.getData('text/plain');
                const pastedRows = pastedText.replace(/\r/g, '').replace(/\n+/g, '\n').split('\n').filter(row => row.trim() !== '');
                let currentRows = this.subtitulosTextArea.extractRows();
                let currentLen=currentRows!==false?currentRows.length:this.min;
                if (currentLen + pastedRows.length > this.max) {
                    e.preventDefault();
                }
            });
            this.subtitulosTextArea.getElement().addEventListener("input", () => {
                this.subtitulosList = this.subtitulosTextArea.extractRows();
                let lines = this.subtitulosList.length;
                if(lines<=this.max){                 
                    for (let i = 0; i < lines; i++) {
                        if(this.subtitulosList!==false){
                            this.listaSubtitulosArray[i].setSubtituloNombre(this.subtitulosList[i]);
                        }
                    }
                    if(lines==this.max){
                        this.subtitulosTextArea.setValue(this.subtitulosList.join('\n'));
                    }
                }
            });  
          
            this.sliderAnidacion.createSlider(function(values, handle) {
                let lines = this.subtitulosList!==false?this.subtitulosList.length:0;
                this.listaSubtitulos.innerHTML = '';
                this.listaSubtitulos.replaceChildren();
                // console.log(values[handle]+">0="+(values[handle]>0));
                // if(values[handle]>0 && values[handle]<=this.max){
                    for (let i = 0; i < values[handle]; i++) {
                        if(i<this.max){
                            if(this.subtitulosList!==false && i<lines){
                                this.listaSubtitulosArray[i].setSubtituloNombre(this.subtitulosList[i]);
                            }
                            this.listaSubtitulos.appendChild(this.listaSubtitulosArray[i].getSubtitulo());
                            this.listaSubtitulosArray[i].enlazar();   
                        }
                    }
                // }
            }.bind(this));

            this.enlazarCalled = true;
        }
    }
    getTablaConf(){
        return this.element;
    }
    getSubtitulosTextArea(){
        return this.enlazarCalled?this.subtitulosTextArea:false;
    }
    getSubtitulosListTextRows(){
        return this.enlazarCalled?this.subtitulosList:false;
    }
    getForzarTitulo(){
        return this.enlazarCalled?this.forzarTitulo:false;
    }
    getOcultarTitulo(){
        return this.enlazarCalled?this.ocultarTitulo:false;
    }
    getSliderAnidacion(){
        return this.enlazarCalled?this.sliderAnidacion:false;
    }
    getSubtitulosListClassObjects(){
        return this.enlazarCalled?this.listaSubtitulos:false;
    }
    getListaSubtitulosArray(){
        return this.enlazarCalled?this.listaSubtitulosArray:false;
    }
}
class SubtitulosClass extends ElementsClass {
    constructor(apendiceID, subtitulo) {
        super("subtitulos_configuration_" + apendiceID, "div", true);
        this.subtitulo = subtitulo!==false?': '+subtitulo:'';
        this.subtituloTrue=subtitulo!==false?subtitulo:'';
        this.apendiceID = apendiceID;
        this.enlazarCalled = false;
        this.element.classList.add(...['flexColumn', 'center', 'flexDisplay', 'formularios']);
        this.element.innerHTML = `
            <span class="resaltar" id="subtitulo_titulo_form_${this.apendiceID}">Subtitulo ${this.apendiceID}${this.subtitulo}</span>

            <div class="flexDisplay center flexRow">
                <div class="flexDisplay center flexColumn">
                    <div class="flexDisplay center flexRow">
                        <div class="flexDisplay flexColumn">
                            <label for="elementosMaximos_${this.apendiceID}">Elementos Maximos/Columna:</label>
                            <input type="number" name="elementosMaximos_name_${this.apendiceID}" id="elementosMaximos_${this.apendiceID}" min="1" step="1">
                            <span>Columnas Minimas Y Maximas:</span>
                            <div class="ElSlider"><div id="sliderColumnas_${this.apendiceID}"></div></div>
                        </div>
                        <div id="contenido_cojedor_${this.apendiceID}" class="flexColumn center flexDisplay">
                            <label for="cambiarSubtitulo_${this.apendiceID}">Cambiar Subtitulo:</label>
                            <input class="lineaTexto" type="text" id="cambiarSubtitulo_${this.apendiceID}" name="cambiarSubtitulo_name_${this.apendiceID}" placeholder="${this.subtituloTrue !==''?this.subtituloTrue : "No tiene subtitulo."}">
                            <span>Contenido</span>
                            <textarea class="textarea" id="contenido_box_${this.apendiceID}" name="contenido_box_name_${this.apendiceID}" rows="5" cols="25" placeholder="Contenido de un subtitulo"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    setSubtituloNombre(subtitulo) {
        this.subtitulo = ': '+subtitulo;
        this.subtituloTrue=subtitulo
        if(this.enlazarCalled){
            let subtituloTituloForm = this.element.querySelector(`#subtitulo_titulo_form_${this.apendiceID}`);
            subtituloTituloForm.innerHTML = "Subtitulo "+this.apendiceID+this.subtitulo;
            this.cambiarSubtitulo.getElement().placeholder=this.subtituloTrue;
        }
    }
    getSubtitulo() {
        return this.element;
    }

    enlazar() {
        if (!this.enlazarCalled) {
            this.contenidoBox = new TextAreasClass("contenido_box_" + this.apendiceID);
            this.cambiarSubtitulo = new TextInputClass("cambiarSubtitulo_" + this.apendiceID);
            this.elementosMaximos = new NumberInputClass("elementosMaximos_" + this.apendiceID);

            this.sliderColumnas = new SlidersClass('sliderColumnas_' + this.apendiceID, 0, 12, [0, 3]);
            this.sliderColumnas.createSlider();

            this.enlazarCalled = true;
        }
    }

    getContenidoBox() {
        return this.enlazarCalled ? this.contenidoBox : false;
    }

    getCambiarSubtitulo() {
        return this.enlazarCalled ? this.cambiarSubtitulo : false;
    }

    getElementosMaximos() {
        return this.enlazarCalled ? this.elementosMaximos : false;
    }

    getSliderColumnas() {
        return this.enlazarCalled ? this.sliderColumnas : false;
    }
}
class SlidersClass extends ElementsClass{//mejorable
    constructor(slider, min, max, start){
        super(slider, "div");
        this.configuracionSlider = {
            start: start,
            connect: start.length==1?'lower':true,
            range: {
                'min': min,
                'max': max
            },
            behaviour: 'drag-smooth-steps-tap', 
            // tooltips: [true, true],
            step: 1,
            // format: wNumb({
            //     decimals: 0
            // }),
            pips: {
                mode: 'steps',
                stepped: true//,
                // density: 8
            },
            disabled: false
        }
        this.created=false;
        this.separator=",";
    }
    createSlider(callback=false){
        if(!this.created){
            noUiSlider.create(this.element, this.configuracionSlider);
            let activePips = [null, null];
            this.element.noUiSlider.on('update', function (values, handle) {
                // document.getElementById('minLabel').textContent = values[0];
                // document.getElementById('maxLabel').textContent = values[1];
                // Remove the active class from the current pip
                if (activePips[handle]) {
                    activePips[handle].classList.remove('active-pip');
                }
                // Match the formatting for the pip
                let dataValue = Math.round(values[handle]);
                // Find the pip matching the value
                activePips[handle] = this.element.querySelector('.noUi-value[data-value="' + dataValue + '"]');
                // Add the active class
                if (activePips[handle]) {
                    activePips[handle].classList.add('active-pip');
                }
                if (typeof callback === 'function') {
                    callback(values, handle);
                }
            }.bind(this));
            this.handlesCount=this.element.noUiSlider.get(true).length;
            this.created=true;
        }
    }
    setDisable(option){
        this.configuracionSlider.disabled=option;
        this.refreshOptions();
    }
    setMin(min){
        this.configuracionSlider.range.min=min;
        this.refreshOptions();
    }
    setMax(max){
        this.configuracionSlider.range.max=max;
        this.refreshOptions();
    }
    getMin(){
        return this.configuracionSlider.range.min;
    }
    getMax(){
        return this.configuracionSlider.range.max;
    }
    refreshOptions(){
        if(this.created){
            this.element.noUiSlider.updateOptions(this.configuracionSlider);
            return true;
        }
        return false;
    }
    getSeparator(){
        return this.separator;
    }
    getSliderValues(){
        return this.created?this.element.noUiSlider.get(true):false;
    }
    getSliderValueIndex(index=0){
        return this.created?this.element.noUiSlider.get(true)[index]:false;
    }
    getHandlesCount(){
        return this.created?this.handlesCount:false;
    }
}
class NumberInputClass extends ElementsClass{
    constructor(id,create=false){
        super(id, "input",create);
        this.element.type="number";
    }
    getNumberValue(){
        return this.element.value;
    }
}
class TextInputClass extends ElementsClass{
    constructor(id,create=false){
        super(id, "input",create);
        this.element.type="text";
    }
    getTextInputValue(){
        return this.element.value.trim();
    }
    setTextInputValue(text){
        this.element.value=text.trim();
    }
}
class SelectsClass extends ElementsClass{
    constructor(id,defaultOption,create=false){
        super(id,"select",create);
        this.textOfRows = [];
        this.rows=[];
        this.defaultOption = document.createElement('option');
        this.defaultOption.value = defaultOption;
        this.defaultOption.text = defaultOption;
        this.element.appendChild(this.defaultOption);
    }
    rowsIntoSelectOptions(rows) {
        if(rows!==false){
            this.rows=rows;
            this.textOfRows = [];
            this.textOfRows.length = rows.length;
            if (this.element) {
            this.element.innerHTML ="";
            this.element.appendChild(this.defaultOption);
                if(rows.length >0){
                    rows.forEach(row => {
                        const option = document.createElement('option');
                        option.value = row;
                        option.text = row;
                        this.element.appendChild(option);
                    });
                }
            }
        }
    }
    setTextOfRows(index, text) {
        if (index >= 0 && index <= this.rows.length) {
            this.textOfRows[index] = text;
        }
    }
    getTextOfRows(index) {
        return this.textOfRows[index] || "";
    }
    getSelectedText(){
        return this.element.options[this.element.selectedIndex].text;
    }
    getSelectedTextOfRows(){
        return this.textOfRows[this.element.selectedIndex].text;
    }
    getOptions(){
        return this.element.options;
    }
    getSelectedIndex(){
        return this.element.selectedIndex;
    }
    getRows(){
        return this.rows;
    }
}


class TextAreasClass extends ElementsClass{
    constructor(id,create=false){
        super(id,"textarea",create);
    }
    extractRows(){
        let arr=this.element.value.split('\n').filter(row => row.trim() !== "");
        return arr.length>0?arr:false;
    }
}

    function textAreaManagment(options, id) {
        let oldId = previousSelectedIndex >= 0 ? options[previousSelectedIndex].innerText : null;
        let newId = options.selectedIndex >= 0 ? options[options.selectedIndex].innerText : null;
        previousSelectedIndex = options.selectedIndex;
        console.log(oldId + " " + newId);
        let oldTextarea = oldId ? document.getElementById(id + oldId) : null;
        let newTextarea = newId ? new TextAreas(id + newId) : null;
        if (oldTextarea) oldTextarea.style.display = "none";
        if (newTextarea) {
            newTextarea.doOperations(function(textarea) {
                textarea.style.display = "block";
                textarea.addEventListener("input", function() {
                    localStorage.setItem(id + newId, textarea.value);
                }); 
            });
        }
    }
class TextAreaLinkSelectClass extends EnlacesClass{
    constructor(textArea, select) {
        textArea=textArea instanceof TextAreasClass ? textArea : null;
        select= select instanceof SelectsClass ? select : null;
        super([textArea,select]);
        this.rows=[];
        this.enlace[0].getElement().addEventListener("input", () => {
            this.rows=this.enlace[0].extractRows();
            this.sendFromTextAreaToSelect();
        }/*.bind(this)*/);
    }
    getTextArea(){
        return this.enlace[0];
    }
    getSelect(){
        return this.enlace[1];
    }
    setRows(){
        this.rows=this.enlace[0].extractRows();
    }
    getRows(){
        return this.rows;
    }
    sendFromTextAreaToSelect(){
        this.enlace[1].rowsIntoSelectOptions(this.rows);
    }
}
class SelectLinkTextInputClass extends EnlacesClass{
    constructor(select, textInput) {
        select= select instanceof SelectsClass ? select : null;
        textInput= textInput instanceof TextInputClass ? textInput : null;
        super([select,textInput]);
        this.enlace[1].getElement().addEventListener("input", () => {
            this.selected=this.enlace[0].getSelectedIndex();
            let texto=this.enlace[1].getTextInputValue();
            this.enlace[0].setTextOfRows(this.selected, texto);
        });
        this.enlace[0].getElement().addEventListener("change", () => {
            this.selected=this.enlace[0].getSelectedIndex();
            this.enlace[1].setTextInputValue(this.enlace[0].getTextOfRows(this.selected));
        });
    }
    getSelect(){
        return this.enlace[0];
    }
    getTextInput(){
        return this.enlace[1];
    }
}
function obtenerFormulario(){
    const margen="<br><br><br><br>";
    const blanco = "#ffffff";
    const negro = "#000000";
    const naranjaP="#aa3d00";
    const naranjaS="#db9d00";
    const naranjaT="#ffdbb9";
    const azulP="#0051A3";
    const azulS="#61bee9";
    const azulT='#d9e8ff';
    const verdeP="#3c6500";
    const verdeS="#93a140";
    const verdeT="#cdffcd";
    const moradoP="#5f0079";
    const moradoS="#8a53c2";
    const moradoT="#e4cdff";
    const rojoP="#ce170c";
    const rojoS="#ce332a";
    const rojoT="#ff6968";

    const coloresPrincipales=[azulP,naranjaP,verdeP,moradoP];
    const coloresSecundarios=[azulS,naranjaS,verdeS,moradoS];
    const coloresColumnas=[azulT,naranjaT,verdeT,moradoT];
    const coloresFlechas=[moradoS,verdeS,azulS,naranjaS];

    document.getElementById("todas_tablas").innerHTML="";
    
    let cabecera=new CabeceraClass(window.curso.getTextInputValue(),window.nombreUnidadesAcronimo.getTextInputValue());
    let unidades=window.enlacesPerma[0].getRows();
    cabecera.setUnidades(unidades, unidades.length,window.nombreUnidades.getTextInputValue());
    cabecera.setUnidadActual(window.unidadesSelect.getSelectedIndex(), window.unidadesSelect.getTextOfRows(window.unidadesSelect.getSelectedIndex()));
    cabecera.fillScormTree();

    //configuracion de todas las tablas recoleccion de info
    let tituloTabla=new TextInputClass("tituloTabla").getTextInputValue();
    let numTablas=window.sliderTablas.getSliderValueIndex();
    let tituloTablaIterabilidad=document.getElementById("tituloTablaIterabilidad").checked;
    let ocultarTodosTitulos=document.getElementById("ocultarTodosTitulos").checked;
    
    let colorIndex=0;
    //tablas individuales config
    for(let i=0; i<numTablas; i++){
        let crearTabla=false;
        colorIndex=i%coloresPrincipales.length;
        let tablax=window.listaTablasConfArray[i];
        let ocultarTitulo=tablax.getOcultarTitulo().checked;
        let forzarTitulo=tablax.getForzarTitulo().value;
        let subtitulosList=tablax.getSubtitulosListTextRows();
        let anidacion=tablax.getSliderAnidacion().getSliderValueIndex();
        //cada uno de estos lo es tanto con subtitulo o con contenido, sin ambos no
        let titulo=false;
        if(!ocultarTodosTitulos){
            if(!ocultarTitulo){
                if(tituloTabla!==""){
                    titulo=tituloTabla;
                }
                if(forzarTitulo!==""){
                    titulo=forzarTitulo;
                }
                if(!tituloTablaIterabilidad){
                    if(titulo==false){
                        titulo="";
                    }else{
                        titulo=titulo+" ";
                    }
                    titulo=titulo+(i+1);
                }
                if(typeof(titulo)=="string"){
                    crearTabla=true;
                }
            }
        }
        let tabla=new TablasClass(coloresSecundarios[colorIndex],titulo);
        tabla.setTituloPropety("color",blanco);
        for(let j=0; j<anidacion; j++){
            let subtitulosConfsList=tablax.getListaSubtitulosArray();
            if(subtitulosList!==undefined){//apagar iteravilidad vs apagar el +1 al lado del titulo
                if(subtitulosList.length>j){  
                    let cambiarSubtitulo=subtitulosConfsList[j].getCambiarSubtitulo().getTextInputValue();
                    tabla.setSubtitulo(cambiarSubtitulo===""?subtitulosList[j]:cambiarSubtitulo,"subtitulo"+(j+1),coloresSecundarios[colorIndex]);
                    crearTabla=true;
                }
            }
            let elementosColumnas=subtitulosConfsList[j].getContenidoBox();
            let columnas=false;
            if(elementosColumnas!==false){
                let elementos=elementosColumnas.extractRows();
                let sliderColumnas=subtitulosConfsList[j].getSliderColumnas();
                columnas=new ColumnsContainersClass("ColumnasContainer",subtitulosConfsList[j].getElementosMaximos().getNumberValue(),sliderColumnas.getSliderValueIndex(0),sliderColumnas.getSliderValueIndex(1));
                columnas.setColumnsColor(coloresColumnas[colorIndex]);
                if(columnas.buildContainer("contenido" + (j+1),elementos)){
                    tabla.setColumnasPorListas(columnas.getContainer());
                    crearTabla=true;
                }
            }      
        }
        tabla.buildTabla();

        if(crearTabla){
            let bloquer = new BloquesFlechaClass(i,i == numTablas-1? true : false);
            bloquer.setFlechaColor(coloresFlechas[colorIndex],blanco);

            bloquer.buildBloque(tabla.getTablaContenidos());
        }
    }

    let scormTree = document.getElementById('scorm_tree').outerHTML;
    let htmlContent = scormTree;

    let plant_info=document.querySelector(".plantilla_info");
    plant_info.insertAdjacentHTML('beforebegin', margen);
    htmlContent = htmlContent+margen+plant_info.outerHTML;

    let todasTablas=document.getElementById("todas_tablas");
    todasTablas.style.display="flex";
    todasTablas.style.flexDirection="column";
    todasTablas.style.alignItems="center";
    todasTablas.innerHTML=todasTablas.innerHTML+margen;
    htmlContent += todasTablas.outerHTML;

    document.getElementById('texto').value = htmlContent+margen;
}
function extractOptions(idRows, idBox){
    let options=document.getElementById(idRows).options;
    let result=[];
    for (let i=0; i < options.length; i++) {
        let newId = options[i].text;
        let storedValue = localStorage.getItem(idBox + newId);
        if (storedValue) {
            result.push(storedValue);
        }
    }
    return result;
}
