import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const apiKey = "";

const dummyCoords = [
  {
    latitude: 51.5,
    longitude: -0.12,
  },
  {
    latitude: 51.6,
    longitude: -0.1
  }
]

const RiderInRideMap = ({ ride }) => {

  const mapRef = useRef();

  const pickupCoordinates = {
    latitude: ride.pickupCoordinates.lat,
    longitude: ride.pickupCoordinates.lng
  }

  const dropoffCoordinates = {
    latitude: ride.dropoffCoordinates.lat,
    longitude: ride.dropoffCoordinates.lng
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 51.50072919999999,
        longitude: -0.1246254,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
      }}
      mapType='mutedStandard'
      ref={mapRef}
      onMapReady={() => {mapRef.current.fitToCoordinates([pickupCoordinates, dropoffCoordinates], {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      })}}
    >
      <Marker
        coordinate={pickupCoordinates}
        title='Pickup'
        description={ride.pickupLocation}
        identifier='pickupLocation'
      />

      <Marker
        coordinate={dropoffCoordinates}
        title='Dropoff'
        description={ride.dropoffLocation}
        identifier='dropoffLocation'
      />

      <MapViewDirections
        origin={pickupCoordinates}
        destination={dropoffCoordinates}
        apikey={apiKey}
        strokeWidth={3}
        strokeColor='red'
      />
    </MapView>
  )
}

export default RiderInRideMap

const styles = StyleSheet.create({})
