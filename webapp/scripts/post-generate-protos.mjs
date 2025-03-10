import * as fs from 'node:fs';

if (!fs.existsSync('./src/proto/generated')) {
  console.error(
    'Generated proto files not found. Run `npm run generate-proto`',
  );
  process.exit(1);
}

// file name change for using .cjs instead of .js
function changeFileName() {
  {
    const file = './src/proto/generated/aliceapi_pb.js';
    const newFile = './src/proto/generated/aliceapi_pb.cjs';
    if (fs.existsSync(newFile)) {
      fs.unlinkSync(newFile);
    }
    fs.renameSync(file, newFile);
  }
  {
    const file = './src/proto/generated/aliceapi_pb.d.ts';
    const newFile = './src/proto/generated/aliceapi_pb.d.cts';
    if (fs.existsSync(newFile)) {
      fs.unlinkSync(newFile);
    }
    fs.renameSync(file, newFile);
  }
}

// change import path for using .cjs instead of .js
function changeImportPath() {
  {
    const file = './src/proto/generated/AliceapiServiceClientPb.ts';
    const fileContent = fs.readFileSync(file, 'utf-8');
    const newFileContent = fileContent.replace(
      /from '.\/aliceapi_pb';/g,
      "from './aliceapi_pb.cjs';",
    );
    fs.writeFileSync(file, newFileContent);
  }
  {
    const file = './src/proto/generated/aliceapi_pb.cjs';
    const fileContent = fs.readFileSync(file, 'utf-8');
    const newFileContent = fileContent.replace(
      /require\('.\/aliceapi_pb.js'\);/g,
      "require('./aliceapi_pb.cjs');",
    );
    fs.writeFileSync(file, newFileContent);
  }
}

function main() {
  changeFileName();
  changeImportPath();
}

main();
