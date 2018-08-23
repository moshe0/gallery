import * as React from 'react';


interface Iimage {
    id : number,
    src : string
}

interface IAppState {
    srcArr : Iimage[]
}

class App extends React.Component<{}, IAppState> {
    db : any;
    constructor(props: {}) {
        super(props);

        this.state = {
            srcArr: []
        };
    }

    onAdd = (e: React.ChangeEvent<HTMLInputElement>) =>{
        let file = e.target.files;
        if (file) {
            const fr = new FileReader();
            fr.onload = (data) => {
                this.AddToIndexDB(fr.result);
            };
            fr.readAsDataURL(file[0]);
        }
    };


    AddToIndexDB = (result : any) =>{
        let tran = this.db.transaction(["Images"], "readwrite");

        tran.oncomplete = function() {
            console.log("tran oncomplete");
        };

        tran.onabort = function() {
            console.log("tran onabort")
        };

        tran.onerror = function() {
            console.log("tran onerror")
        };

        const images = tran.objectStore("Images");
        const request = images.add({src: result});

        request.onsuccess = (e : any) =>{
            console.log("add success", e);

            let aaa = this.state.srcArr;
            aaa.push({id: e.target.result ,src: result});

            this.setState({
                srcArr: aaa
            });
        };

        request.onerror = (e : any) =>{
            console.log("add error", e);
        };
    };


    initIndexDB = () =>{
        const request = indexedDB.open("ImagesDB", 1);

        request.onsuccess = (e : any) =>{
            console.log("DB opened successfully");
            this.db = e.target.result;
            this.getImages();
        };

        request.onupgradeneeded = (e : any) =>{
            console.log("upgradeneeded", e);
            const dbdd = e.target.result;
            dbdd.createObjectStore("Images", {keyPath: "id", autoIncrement: true});
        };

        request.onerror = (err : any) =>{
            console.error(err);
        };
    };

    getImages = () =>{
        let tran = this.db.transaction(["Images"], "readonly");

        tran.oncomplete = function() {
            console.log("tran oncomplete")
        };

        tran.onabort = function() {
            console.log("tran onabort")
        };

        tran.onerror = function() {
            console.log("tran onerror")
        };

        const images = tran.objectStore("Images");
        const request = images.openCursor();
        let storeImages : Iimage[] = [];

        request.onsuccess = (e : any) =>{
            console.log("add success", e);
            let cursor = e.target.result;
            if (cursor) {
                storeImages.push(cursor.value);
                cursor.continue();
            }
            else{
                console.log("Done Reading!");
                this.setState({
                    srcArr: storeImages
                });
            }
        };

        request.onerror = (e : any) =>{
            console.log("add error", e);
        }
    };

    componentWillMount(){
        this.initIndexDB();
    }


    public render() {
        console.log(this.state.srcArr);
        const listSrc = this.state.srcArr.map((item, idx) => {
            return <img key={idx} className="image" src={item.src}/>
        });


        return (
            <div className="Images">
                <label htmlFor="file-input" className="input-label-add">
                    <input type="file" id="file-input" accept="image/png, image/jpeg" onChange={this.onAdd}/>
                </label>
                {listSrc}
            </div>

        );
    }
}

export default App;