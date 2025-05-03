
var parser = require('node-html-parser');

async function getData(){
    const url = 'http://www.radicaleye.com/lifepage/picgloss/picgloss.html';
    const req = new Request(url);
    const resp = await fetch(req).catch((e)=>{
        console.log('error occured in fecthing data:',e);
    });
    const data = await resp.text();
    //console.log(data);
    const html = null;
    return data;
}

const data = getData();
const doc = parser.parse(data);

const hrtags = doc.querySelector('p');
// const ps = hrtags.querySelector('p');
// need to finish parsing configs