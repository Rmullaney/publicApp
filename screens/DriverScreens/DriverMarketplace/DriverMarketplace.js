import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { firestore } from '../../../API/firbaseConfig'
import MarketRide from '../../../components/Cards/Driver/MarketRide/MarketRide'
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context';


// Driver can choose from these to change the rides shown
const FILTER_OPTIONS = [
	{ id: '1', filter: 'Newest' },
	{ id: '2', filter: 'Soonest' },
	{ id: '3', filter: 'Date' },
	{ id: '4', filter: 'Price' },
]

export default function DriverMarketplace() {
	// Upcoming ride data to be used for display
	const [marketRides, setMarketRides] = useState(newestRides);

	// States for the filter by date functionality
	const [byDateRides, setByDateRides] = useState([]);
	const [dateToFilterBy, setDateToFilterBy] = useState(new Date());

	// Used to toggle the modal that holds the datepicker
	const [showDatePicker, setShowDatePicker] = useState(false);

	// Rides for the sorting filters
	const [newestRides, setNewestRides] = useState([]);
	const [soonestRides, setSoonestRides] = useState([]);
	// const [priceSortedRides, setPriceSortedRides] = useState([]);

	// Used to toggle style when buttton is selected
	const [activeButton, setActiveButton] = useState('Newest');

	useEffect(() => {
		const getNewestRides = () => {
			// Collection reference
			const rideRef = collection(firestore, "ride");
	
			// Fetches all upcoming rides where the user is the driver
			const q = query(rideRef,
				where('status', '==', 'pendingDriver'),
				orderBy('createdAt', 'desc')
			)
	
			// Allows realtime updates when ride collection is updated 
			// Sets up the upcoming ride data to be used 
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const rides = []
				querySnapshot.forEach((doc) => {
					rides.push({
						...doc.data(),
						key: doc.id
					})
					setNewestRides(rides)
					// Default sort is by newest
					setMarketRides(rides)
				});
			})
	
			return () => unsubscribe();
		}

		getNewestRides();
	}, [])

	useEffect(() => {
		const getSoonestRides = () => {
			// Collection reference
			const rideRef = collection(firestore, "ride");
	
			// Fetches all upcoming rides where the user is the driver
			const q = query(rideRef,
				where('status', '==', 'pendingDriver'),
				orderBy('pickupDate', 'asc')
			)
	
			// Allows realtime updates when ride collection is updated 
			// Sets up the upcoming ride data to be used 
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const rides = []
				querySnapshot.forEach((doc) => {
					rides.push({
						...doc.data(),
						key: doc.id
					})
					setSoonestRides(rides)
				});
			})
	
			return () => unsubscribe();
		}

		getSoonestRides()
	}, [])

	/* Following function deal wiht the filter by date functionality*/
	// Update date time when date changess
	// { type }, selectedDate
	const onDateConfirm = () => {
		getDateRides();
	}

	const onDateChange = ({ type }, selectedDate) => {
		const currentDate = new Date(selectedDate)

		setDateToFilterBy(currentDate);
	}

	// Used to set lower and upper boundary dates for the filter
	function endAndStartOfDay(date) {
		var result = new Date(date);
		const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

		let startOfDay = (Math.floor(result / interval) * interval - 2);
		let endOfDay = startOfDay + interval + 2; // 23:59:59:9999

		const upperDate = new Date(endOfDay)
		const lowerDate = new Date(startOfDay)

		return { upperDate, lowerDate };
	}

	// Fetches all rides on the date specified by the dateToFilterBy
	const getDateRides = () => {
		const { upperDate, lowerDate } = endAndStartOfDay(dateToFilterBy);
		console.log('date to get rides', dateToFilterBy)

		// Collection reference
		const rideRef = collection(firestore, "ride");

		// Fetches all upcoming rides where the user is the driver
		const q = query(rideRef,
			where('status', '==', 'pendingDriver'),
			where('pickupDate', '<', upperDate),
			where('pickupDate', '>', lowerDate)
		)

		// Allows realtime updates when ride collection is updated 
		// Sets up the upcoming ride data to be used 
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const rides = []
			querySnapshot.forEach((doc) => {
				rides.push({
					...doc.data(),
					key: doc.id
				})
			});
			setByDateRides(rides)
		})

		return () => unsubscribe();
	}

	// Used to change what rides are displayed based on the chosen filter
	const toggleData = () => {
		console.log(activeButton)
		if (activeButton === 'Newest') {
			setMarketRides(newestRides);
		} else if (activeButton === 'Soonest') {
			setMarketRides(soonestRides);
		} 
	}

	// Fetches data for the dateToFilterBy
	// useEffect(() => {
	// 	getDateRides();
	// 	setActiveButton('Date');
	// }, [dateToFilterBy])

	// Sets market rides to be byDateRides whenenver byDateRides changes
	useEffect(() => {
		setMarketRides(byDateRides);
		// setActiveButton('Date');
	}, [byDateRides])

	// Retrieves upcoming ride data when the page loads
	// useEffect(() => {
	// 	getNewestRides();
	// 	getSoonestRides();
	// 	setActiveButton('Newest')
	// }, []);

	// Changes the data to be displayed based on what filter is active
	useEffect(() => {
		toggleData()
	}, [activeButton])

	return (
		<View style={styles.container}>
			<View>
				<View style={styles.headerContainer}>
					<Text style={styles.headerText}>Claim a ride!</Text>

					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ marginLeft: 10, fontWeight: 400, fontSize: 13}}>Sort by: </Text>
						<TouchableOpacity
							style={{
								backgroundColor: activeButton === 'Newest' ? 'red' : '#f2f2f2',
								marginHorizontal: 4,
								paddingHorizontal: 10,
								paddingVertical: 4,
								borderRadius: 21,
								color: activeButton === 'Newest' ? 'white' : 'black',
							}}
							onPress={() => {
								setActiveButton('Newest');
							}}
						>
							<Text
								style={{ color: activeButton === 'Newest' ? 'white' : 'black', }}
							>
								Newest
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								backgroundColor: activeButton === 'Soonest' ? 'red' : '#f2f2f2',
								marginHorizontal: 4,
								paddingHorizontal: 10,
								paddingVertical: 4,
								borderRadius: 21,
								color: activeButton === 'Soonest' ? '#f2f2f2' : 'black',
							}}
							onPress={() => {
								setActiveButton('Soonest');
							}}
						>
							<Text
								style={{ color: activeButton === 'Soonest' ? '#f2f2f2' : 'black', }}
							>
								Soonest
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								backgroundColor: activeButton === 'Date' ? 'red' : '#f2f2f2',
								marginHorizontal: 4,
								paddingHorizontal: 10,
								paddingVertical: 4,
								borderRadius: 21,
							}}
							onPress={() => {
								setShowDatePicker(true);
								setActiveButton('Date')
							}}
						>
							<Text
								style={{ color: activeButton === 'Date' ? 'white' : 'black', }}
							>
								Date
							</Text>
						</TouchableOpacity>
						{/* <TouchableOpacity
						style={{
							backgroundColor: activeButton === 'Price' ? 'lightblue' : 'white', 
							marginHorizontal: 4, 
							paddingHorizontal: 10,
							paddingVertical: 4,
							borderRadius: 21,
						}}
						onPress={() => {
							setActiveButton('Price');
						}}
					>
						<Text 
							style={{color: activeButton === 'Price' ? 'white' : 'black',}}
						>
							Price
						</Text>
					</TouchableOpacity> */}
					</View>
				</View>
			</View>

			<View>
				<FlatList
					data={marketRides}
					renderItem={({ item }) => {
						return (
							<MarketRide ride={item} />
						)
					}}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={
						<View style={{height: 4}}></View>
					}
				/>
			</View>

			{showDatePicker && (
				<View style={{ justifyContent: 'center', alignItems: 'center' }}>
					<Modal
						isVisible={true}
						animationIn={'slideInUp'}
						animationOut={'slideInDown'}
						animationType={'slide'}
						backdropOpacity={0.2}
						style={{
							justifyContent: 'flex-end',
							alignItems: 'center',
							backgroundColor: 'white',
							margin: 0,
							paddingBottom: 40,
							marginTop: '120%',
							borderTopLeftRadius: 21,
							borderTopRightRadius: 21
						}}
					// onSwipeComplete={() => setShowDatePicker(false)}
					// swipeDirection="down"
					>
						<DateTimePicker
							value={dateToFilterBy}
							onChange={onDateChange}
							// onChange={setDateToFilterBy(dateToFilterBy)}
							mode='date'
							display='inline'
						/>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity
								style={{ marginRight: 40 }}
								onPress={() => {
									setShowDatePicker(false)
									setActiveButton('Newest')
								}}
							>
								<Text style={{ color: '#007AFF', fontSize: 18 }}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									// setDateToFilterBy(dateToFilterBy)
									// onDateConfirm()
									getDateRides()
									setShowDatePicker(false)
								}}
							>
								<Text style={{ color: '#007AFF', fontSize: 18 }}>Confirm</Text>
							</TouchableOpacity>
						</View>
					</Modal>
				</View>
			)}

			{/* <Button onPress={() => setShowDatePicker(true)}/> */}
		</View>
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 6
	},
  headerText: {
    fontSize: 18,
    fontWeight: 500,
    paddingTop: '2%',
    paddingBottom: '1%'
  },
	headerContainer: {
		padding: 10,
		paddingLeft: 16
	}
});