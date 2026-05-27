function rngSeries(seed){
	// Goal: return a sequence of numbers based on the seed, which contains values bwteen 0 and 1
	// The returned values must be returned one after the other each time the function is called. 
	// Let the seed be a SHA256 hash. 
}
// T o explore, a distribution of average of a hash in binary	
function* random(array){
	let i = 0 
	while(i<array.length)
	yield array[i++]
}


function randomnessBenchmark(rndfn, limit){
	// evaluate the random function by calling it a certain number of times to see how randomly it distributes data, and how far apart the values are.
	// plot a graph of the distribution, and the distance between 2 sucessive random calls.
	// the graph should be flat, and the flatter it is the better. it should be evenly spread across 0 to 1.
	// the randomness should also converge to 1/n for a 1/nth subset. 
	let distribution  = [0]*10 // an array going from 0 to 1 in values acc. to index, i.e index 0 is (0, 0.1] and index 9 is (0.9, 1]
	let distance = [0]*21 // an array going from -1 to +1 in values acc. to index, i.e index 0 represents [-1, -0.9]
	let prevNum = 0

	for ( let i = 0; i < limit; i++){
		let testnum = rndfnc()
		let difference = testNum - prevNum
		prevNum = testNum
		
		for (let j = 0.1; j <= 1; j+= 0.1){
			if(testnum <= j && testnum > j - 0.1){
				distribution[j*10 - 1]++
			}else continue 
		}
		for (let j = -1; j<= 1; j+=0.1){
			if(difference<=j && difference> j-0.1){
				distance[j*10 + 10]++
			}else continue
		}
	}


}



class Statistics {
	constructor(testarray){
		this.arr = testarray
	}
	median(arr){
		// sort the list and return the most common element
		let sortedarr = arr.sort()
		return sortedarr[Math.ceil(arr.length) -1]
	}
	mean(arr){
		sum = 0;
		for( a of arr){
			sum += a
		}
		return sum/arr.length
	}
	mode(arr){
		// lets say the data is [0,2, 34,5,3,1] mode is 34
		let sortedarr = arr.sort
		
	}
	range(arr){
		return arr.indexOf(Math.max(arr))
		
	}
}