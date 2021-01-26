/*
V2.0 2020-05-16: 
	Now Asyncronous ( previously used Sync ). 
	Now includes file/folder details
	Now includes bypassing specific folder paths

V2.1 2020-05-17: 
	Using big arrow syntax on async functions
	Also cleaned the code up a bit
	
V2.2 2020-07-29: 
	Have an issue where sub-folders show up as arrays with objects in them and I need everything to be flat
	-- .flat(Infinity) seems to have resolved that issue
	
V2.3 2021-01-10: I previously didn't have handling for non-existant folders;
	-- now they send back null instead of crashing with an unhandled error
	-- other errors not yet handled

V2.4 2021-01-10: The output of this function should really be an array of file and folder objects rather than generic 'targets'
	!! Easy scrubing of path names ( cut of bases for security reasons )
	-- Overall much cleaner code and less uneeded complexity
	-- Now excludes the original source folder because thats uneeded
	-- Only files include sizes and modified values

*/

const fs = require('fs')
const path = require('path')

let AsyncFileScanRecursive = async( target = __dirname, trunc = /^\//  ) =>{

	let checkItem = ( truePath ) => {
		const isTrunc = truePath === trunc
		const relativePath = isTrunc? '/' : truePath.replace(trunc, '')
		
		return new Promise( (resolve) => {
			
			fs.stat( truePath, (err,stat)=>{
				if(err ){ 
					resolve([{err: err.code,attempted:relativePath}])
						// Put in array incase error thrown by a folder
				} else { 
					const { size, mtime }  = stat
					const isFile = stat.isFile()
					const modified = new Date(mtime)
					const ext = isFile? path.extname(relativePath): null
					const folderItem = ( isTrunc || isFile )? 
						null: { folder: relativePath }
					
					resolve( 
						stat.isFile()? 
							{ file: relativePath, modified, size, ext }
							: scanFolder(truePath, folderItem ) 
					)
				}
			})
		})
	}
	
	let scanFolder = async( folderPath, subFolderObj )=> {
		return new Promise( (resolve,reject) => {
			fs.readdir( folderPath, {withFileTypes:false}, (err,list) =>{
				if(err){
					return(err)
				}else {				
					let scan = list
						.map( item => checkItem( `${folderPath}/${item}` ) )
										
					resolve( Promise.all( 
						subFolderObj? [subFolderObj].concat(scan) : scan )	
					) 
					// Add subFolderObj or it won't be included in results
				}
			})
		})
	}

	let output = await checkItem(target, trunc )
	return output? output.flat(Infinity) : null // send null if folder doesnt exist
}


module.exports = { AsyncFileScanRecursive }