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

V3.0 2025-06-24: Massively simplfied the entire process by using the new node:fs promises libarary 
	- Also changed the module type from the old 'require' system to the new 'import' system
*/
'use strict'
import fs from 'node:fs/promises'	// the promises library massively simplifies async
import path from 'path'

/**
* @params FOLDER = the directory path that you want to start searching through
*	IMPORTANT: This is for internal use. Sanitize the output before passing it along to the end user
*/


const AsyncTree = async( DIRECTORY = null, accumulatedItems = [] ) =>{
	if ( !DIRECTORY ){
		throw new Error('AsyncTree() was called without a directory path')
	}

	const items = await fs.readdir(DIRECTORY)

	for ( const item of items ){
		const fullPath = path.join( DIRECTORY, item )
		const stat = await fs.stat(fullPath)
		const isFile = stat.isFile()
		
		if( isFile ){
			const { size, mtime } = stat

			accumulatedItems.push({
				file: item,
				size, 
				mtime,
				parentFolder: DIRECTORY,
				filePath: fullPath
			})
		} else {
			
			accumulatedItems.push({
				folder: item,
				folderPath: fullPath
			})

			const subFiles = await AsyncTree(fullPath, accumulatedItems)
	
		}
		
	}

	return accumulatedItems
}

export default AsyncTree