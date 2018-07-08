import * as React from 'react';
// import * as fs from "fs";


interface IAppState {
    srcArr : string[]
}

class App extends React.Component<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            srcArr: []
        };

    }

    /*
    readFile() {
        return fs.readFileSync(`${__dirname}\\ArrSrc.json`).toString();
    }


    writeFile(){
        fs.writeFile(`${__dirname}\\ArrSrc.json`, JSON.stringify(this.state.srcArr), function(err) {
            if (!!err)
                return "failed";
            else
                return "succeeded";
        });

    }
    */

    onAdd = (e: React.ChangeEvent<HTMLInputElement>) =>{
        let file = e.target.files;
        if (file) {
            const fr = new FileReader();
            fr.onload = (data) => {
                let arr = this.state.srcArr;
                arr.push(fr.result);
                this.setState({
                    srcArr: arr
                });
            };
            fr.readAsDataURL(file[0]);
        }
    };


    public render() {
        console.log(this.state.srcArr);
        const listSrc = this.state.srcArr.map((item, idx) => {
            return <img key={idx} className="image" src={item}/>
        });


        return (
            <div className="Images">
                <label htmlFor="file-input" className="input-label">
                    Add image
                    <input type="file" id="file-input" accept="image/png, image/jpeg" onChange={this.onAdd}/>
                </label>
                {listSrc}
            </div>

        );
    }
}

export default App;