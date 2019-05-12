const fs = require('fs');
const stream = require('stream');

const folderPath = process.argv[2]
const searchPattern = process.argv[3]

fs.readdir(folderPath,(err, files) => {
  let result = []    
  if(err){
    console.log("we got error",err)
    return
  } 
  files.forEach(file => {
     let textResult = await startSearchEngine(folderPath,file,searchPattern);
     result.push(textResult)
  });
});

startSearchEngine = folderPath,file,searchPattern => {
  let result
  searchPattern = parseMultiSpace(searchPattern)
  let lengthOfPattern = Buffer.from(searchPattern).length
 
  const readabaleContents = fs.createReadStream(folderPath+"/"+file,{ highWaterMark: lengthOfPattern});
  readabaleContents.on('data', (chunk)=> {
    result = executeContext(chunk,searchPattern)
  });
  
  var end = new Promise(function(resolve, reject) {
    readabaleContents.on('end', () => {resolve(result)});
  })
}


/***************************************************************
 * function : maximumIncrementalSequence
 * in a given array, it finds the maximum sequential array
 * for example: [1,2,6,7,8] => 3
 * for example:[1,2,3,6,7] => 3
 * *************************************************************/
maximumIncrementalSequence = arg => {
  let max =[]
  let newArg = []
  let count= 0
  let elseBool = false

  arg.forEach(element => {
      if(element === -1)
        newArg.push(-10)
      else
        newArg.push(element)
  })
  let first = newArg.slice(0,newArg.length-1)
  let second = newArg.slice(1,newArg.length)
  for(let i=0;i<first.length;i++){
         exist = second[i]-first[i]
         if(elseBool){
          max.push(count)
          count=0
          elseBool = false
        }
        if(exist === 1) {
          count++
          if(i == first.length-1) max.push(count)
        }
        else elseBool = true
    }
   if(count!=0)max.push(count)
   return Math.max(...max)
}

/***************************************************************
 * function : isFilter
 * find the weight of percentage of sentence occurs in file
 * *************************************************************/
isFilter = (source,destination)=> {
       
   let result = destination.split(' ').map(element => source.split(' ').indexOf(element))
   let incementalCount = maximumIncrementalSequence(result)
   return (incementalCount+1) / result.length
}


/***************************************************************
 * function : parseMultiSpace
 * multispace can prevent to find the right match 
 * *************************************************************/
parseMultiSpace = str => {
  let s = str.trim().split(' ')
  return s.reduce((prev,next) => {
      if(next === "")
         return prev
      else return prev.concat(" ",next)
  })
}


/***************************************************************
 * function : isFilterResult
 * source: text pattern
 * destination:sentence which will be find
 * if destination is all occurs in text it will return true
 * *************************************************************/
isFilterResult = (source,destination)=> {
   let exist = 0
   let _destination = destination.split(' ')
   let _source = source.split(' ')
   let result = _destination.map(element => _source.indexOf(element))
   if(result.includes(-1)) return false
   else{
     for(let i=0,j=1;i<result.length-1,j<result.length;i++,j++){
        exist = Math.abs(result[j]-result[i]) + exist
    }
    if(exist === result.length-1) return true
    else return false
   }
}


/***************************************************************
 * function : isFilterResult
 * source: text pattern
 * destination:sentence which will be find
 * if destination is all occurs in text it will return true
 * *************************************************************/
executeContext = (s,pattern) => {
 
let temp= ""
let slicePattern=0
let we_find_it = false
let moduloResultArr = []  
let resultMessage 
 
for(let i=0;i<s.length;i=i+pattern.length){
   chunk = s.substr(i,pattern.length)
   if(chunk !== pattern){
     temp = temp.concat(chunk)
     if(temp.length != pattern.length){
       let tempPattern = temp.split(' ').slice(slicePattern)
       moduloResultArr= []
       for(j=1;j<tempPattern.length;j++){
         let newIteratifTemp = tempPattern.slice(j).join(' ')
         if(newIteratifTemp.length < pattern.length)break
         if(isFilterResult(newIteratifTemp,pattern)){
            resultMessage = "we find it with %100" 
            we_find_it =true
            break
         }
         else{
           moduloResultArr.push(isFilter(newIteratifTemp,pattern))
         }
       }
       slicePattern++
       if(we_find_it) break
     }
   }
   else {
      resultMessage = "we find it with %100"
      we_find_it =true
      break
   }
}
if(!we_find_it) resultMessage = "we find it with %".concat(100*Math.max(...moduloResultArr)))

return resultMessage
}
