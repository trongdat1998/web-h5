importScripts("./pako_inflate.min.js");

onmessage = e => {
  const data = e.data;
  let reader = new FileReader();
  reader.readAsArrayBuffer(data);
  reader.onload = evt => {
    if (evt.target.readyState == FileReader.DONE) {
      let result = new Uint8Array(evt.target.result);
      let data = JSON.parse(pako.inflate(result, { to: "string" }));
      postMessage(data);
    }
  };
};

onerror = e => {
  console.log(e.msg);
};
