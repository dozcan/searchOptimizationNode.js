# searchOptimizationNode.js

this optimizer reads files and search for sentence in a good memory way by Doğa Özcan

/*********************************************************************************************************************
main algorithm depends on optimization (i assume only 1 space between words in text files, this is critical for algorithm)
1) i didnt want to take all data to memory for searching sentence
2) i take chunk to chunk to memory as a lenght of data equals to sentence length(search pattern)
3) algoritm depends on creating new chunks from previous and next chunks
  for example lets say
  text    : i want to go to school but it think i am ill
  pattern : i am ill
  
  datas will be like these
  next sentence = want to go
  next sentence = to go to
  next sentence = go to school
  
  then we will find "i am ill"
  
4) for weight of pattern i am take an algorithm functions 
5)for example lets say
  text    = collection of well-known quotations that are associated with the well-known quotations is that associated
  pattern = well-known quotations is associated
  result = %50 in first part, %75 in second part and then result is %75
  
6)for example lets say
  text    = "the well-known quotations is that associated for insane collection of well-known quotations that are"
  pattern = "there well-known quotations is"
  result  = "well-known quotations is" => %75 not %50
  
7)for example lets say
  text    = "the wellknown quotations is that associated for insane collection of well-known quotations that are"
  pattern = "there wellknown quotations is an"
  result  = "well-known quotations is" => %60
 
8)for example lets say (if we got multiparse in sentence which will be searched)
  text    = "individual, and sayings to the English language in daily use. Here's a"
  pattern = "ande sayings    to    the    English language"
  result  = "well-known quotations is" => %83
9)for example lets say (if we got multiparse in sentence which will be searched)
  text    = "individual, and sayings to the English language in daily use. Here's a"
  pattern = "sayings    to    the    English language"
  result  = "well-known quotations is" => %83
*****************************************************************************************************************************/
