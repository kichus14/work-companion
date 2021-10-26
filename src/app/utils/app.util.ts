
export function bytesToSize(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 Byte';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[ i ];
}

export function csvJSON(csv: string): any {
  const lines = csv.split('\n');
  const result = [];
  let columnSeperator = ',';
  const headerLine = lines[0].trim();
  if (headerLine.indexOf(columnSeperator) < 0) {
    columnSeperator = '\t';
  }
  const headers = headerLine.replace('\r', '').split(' ').join('').split(columnSeperator);
  for (let i = 1; i < lines.length; i++) {
    const obj: any = {};
    const currentLine = lines[i].replace('\r', '').split(columnSeperator);
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].toLowerCase()] = currentLine[j];
    }
    result.push(obj);
  }

  return result;
}
