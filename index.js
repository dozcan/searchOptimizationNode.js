const fs = require('fs');

const folderPath = process.argv[2]
const searchPattern = process.argv[3]
let filename = ""

fs.readdir(folderPath,(err, files) => {
  if(err)return
  
  files.forEach(file=> {
      startSearchEngine(folderPath,file,searchPattern).
      then(result => {
            console.log("result",result)
            if(result[0] === "1") console.log("we find it with %100 matching")
            else console.log("we find it with %".concat(100*Math.max(...result[1])))  
        })
      })
})


 startSearchEngine = (folderPath,file,searchPattern) => {
  let lengthOfPattern = Buffer.from(searchPattern).length
  let iterationResult =[]
  let temp = ""
  let slicePattern=0
  const readabaleContents = fs.createReadStream(folderPath+"/"+file,{ highWaterMark: lengthOfPattern});
  var promise = new Promise((resolve,reject)=> {
    readabaleContents.on('data', (chunk)=> {
        if(chunk.toString() === searchPattern){ //lucky chunk fits with pattern
             resolve("1")
             return;
        } 
        else {  //we are not lucky, keep on searching
          temp = temp.concat(chunk.toString())  
          console.log("temp",temp)
          iterationResult = executeContext(temp,searchPattern,slicePattern)  //iterate chunks and create new patterns in chunks which length equals searchPattern
          if(iterationResult[0] === "1"){
            resolve("1")
            return;
          } 
          slicePattern++;
        }                                          
      });
      readabaleContents.on('end', ()=> {
         resolve("0")
         return
      });
  }) 
  return promise
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
   if(result.filter(element => element === -1).length === result.length) return 0
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
   if(result.length>0){
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
executeContext = (temp,pattern,slicePattern) => {
  let iterationResult = [0]
  let moduloResultArr = []
  //temp = parseMultiSpace(temp)
  let tempPattern = temp.split(' ').slice(slicePattern)

  for(j=1;j<tempPattern.length;j++){
      let newIteratifTemp = tempPattern.slice(j).join(' ')
      if(newIteratifTemp.length < pattern.length) break;
      if(isFilterResult(newIteratifTemp,pattern)){
         iterationResult[0] = "1"
         break;
      }
      else moduloResultArr.push(isFilter(newIteratifTemp,pattern))  
  }
  iterationResult.push(moduloResultArr) 
  return iterationResult
} 

