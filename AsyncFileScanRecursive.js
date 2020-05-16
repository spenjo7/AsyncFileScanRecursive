/*
V2.0 2020-05-16: Now Asyncronous ( previously used Sync ). Also includes file/folder details
*/

const fs = require('fs');
const path = require('path');

async function AsyncFileScanRecursive( target = __dirname , opts = {} , parentFolder = '/'  ){
	async function skipCheck(folderName, parent ){
		return new Promise( (resolve) => {
			let skipThis = false;
			if( opts && opts.skipFolders && opts.skipFolders.length > 0){
				opts.skipFolders.forEach( bannedFolder => {
					skipThis = folderName.startsWith(bannedFolder)? true : skipThis
				})
			}
			resolve( skipThis? [] : scanFolder(folderName, parent) );
		})
	}
	
	async function checkType( item, parent ){
		return new Promise( (resolve,reject) => {
			fs.stat(item, (err,stat)=>{
				if(err){
					reject(err);
				}else if( stat.isFile() ){
					let modified = new Date(stat.mtime)
					resolve(
						{ 
							parent, 
							item, 
							type: 'file', 
							modified,
							size: stat.size,
							//stat,	//un-comment if you want to see what other info is available
							ext: path.extname(item)
						});					
				} else {
				resolve( skipCheck(item,parent) );
				}
			})
		})
	}
	
	async function scanFolder( folder,parent ){
		return new Promise( (resolve,reject) => {
			fs.readdir( folder, {withFileTypes:false}, (err,list) =>{
				if(err){
					return(err);
				}else {
					let scan = list
						.map( el => checkType( path.join(folder,el) , folder ) );
					resolve( Promise.all( [ {item: folder, parent, type:' folder' } ].concat(scan) ) );
				}
			})
		})
	}

	return await checkType(target, parentFolder );
}

module.exports = { AsyncFileScanRecursive, test:'test'};
