# AsyncFileScanRecursive
Asynchronously Scan for Files in a Directory and Sub-Directories, Return file/folder names and details
--Allows for ignoring of unwanted directories.--
	--- That functionality was depricated because this tool is designed for more targeted scanning. ---
	--- If you have to 'ignore' a folder, then you run the risk of forgetting to ignore it when you really needed to. ---

This Code is very Light Weight at just 3Kb and is designed for use in Node.Js 
The purpose of this code is to allow the server to locate a list of available files which can then be used as a response to a fetch request. The main use case would be if your users are storing project data in files on your enviornment an need to be able to locate their data.

Updated on 2021-01-26: Now the results array can include Files, Folders, and Errors instead of generic "Items"
	+ Inaccessible files/folders are returned as an error objects rather than throwing an error which, if unhandled, can mess with your node.js server  