async function parkingRefresh() {
	let pdata = await fetch('https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json')
    let pjson = await pdata.json()
    let mapped = pjson.map(m => {
        return {
            'name': m.name,
            'available': m.parkingStatus.availableCapacity,
            'total': m.parkingStatus.totalCapacity,
            'open': m.parkingStatus.open 
        }
    })
}