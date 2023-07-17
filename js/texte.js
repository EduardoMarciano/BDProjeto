const lines = [
    "/DATA/0.png",
    "/DATA/1.png",
    "/DATA/2.png",
    "/DATA/3.png",
    "/DATA/4.png",
    "/DATA/5.png"
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
  
    const buffer = Buffer.from(line, 'binary');
  
    console.log(buffer);
  }
  console.log(Buffer.from('2f 44 41 54 41 2f 30 2e 70 6e 67', 'hex'));