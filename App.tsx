/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  Button,
  TextInput,
} from 'react-native';

import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import moment, {Moment} from 'moment';

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: string;
  fuel: string;
  seats: string;
  price_per_day: string;
  available: string;
  vehicle_type_id: string;
};

type VehicleType = {
  id: string;
  name: string;
};

type Customer = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
};

interface KeyValuePair {
  [key: string]: string;
}

export const getVehicles = async (): Promise<Array<Vehicle>> => {
  const response = await fetch('http://localhost:3000/vehicles');
  return await response.json();
};

export const getVehicleTypes = async (): Promise<Array<VehicleType>> => {
  const response = await fetch('http://localhost:3000/vehicleTypes');
  return await response.json();
};

export const vehicleTypesMapped: KeyValuePair = {};
async function mapVehicleTypes(): Promise<void> {
  var vehicleTypes = await getVehicleTypes();

  vehicleTypes.forEach(vehicleType => {
    vehicleTypesMapped[vehicleType.id] = vehicleType.name;
  });
}

export const getCustomers = async (): Promise<Array<Customer>> => {
  const response = await fetch('http://localhost:3000/customers');
  return await response.json();
};

export const customersMapped: Array<ItemType<string>> = [];

async function mapCustomers(): Promise<void> {
  var customers = await getCustomers();

  customers.forEach(customer => {
    customersMapped.push({label: customer.fullname, value: customer.id});
  });
}

export const vehiclesMapped: Array<ItemType<string>> = [];

export const differenceInDays = (a: Moment, b: Moment) => b.diff(a, 'days');

export const getVehicle = async (id: any): Promise<Vehicle> => {
  let response = await fetch('http://localhost:3000/vehicles/' + id, {
    method: 'GET',
  });

  return await response.json();
};

async function mapVehicles(): Promise<void> {
  var vehicles = await getVehicles();

  vehicles.forEach(vehicle => {
    vehiclesMapped.push({
      label: vehicle.brand + ' ' + vehicle.model + ' (' + vehicle.year + ')',
      value: vehicle.id,
    });
  });
}

function App(): JSX.Element {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  //vehicle form
  const [id, setId] = useState('');
  const [model, onChangeModel] = useState('');
  const [brand, onChangeBrand] = useState('');
  const [year, onChangeYear] = useState('');
  const [fuel, onChangeFuel] = useState('');
  const [seats, onChangeSeats] = useState('');
  const [price, onChangePrice] = useState('');
  const [available, onChangeAvailable] = useState('');
  const [vehicleType, onChangeVehicleType] = useState('');
  const [items, setItems] = useState([
    {label: 'Economy', value: '1'},
    {label: 'Estate', value: '2'},
    {label: 'Luxury', value: '3'},
    {label: 'SUV', value: '4'},
    {label: 'Cargo', value: '5'},
  ]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  function handleSubmit() {
    fetch('http://localhost:3000/vehicles' + (update ? '/' + id : ''), {
      method: update ? 'PUT' : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brand: brand,
        model: model,
        year: year,
        fuel: fuel,
        seats: seats,
        price_per_day: price,
        available: available,
        vehicle_type_id: vehicleType,
      }),
    }).then(async () => {
      setVehicles(await getVehicles());
    });
  }

  const assignVehicles = async () => {
    var response = await getVehicles();
    setVehicles(response);
  };

  const handleDelete = async (id: string) => {
    await fetch('http://localhost:3000/vehicles/' + id, {
      method: 'DELETE',
    }).then(() => {
      getVehicles().then(async () => {
        setVehicles(await getVehicles());
      });
    });
  };

  const handleUpdate = async (item: Vehicle) => {
    setId(item.id);
    onChangeModel(item.model);
    onChangeBrand(item.brand);
    onChangeYear(item.year);
    onChangeFuel(item.fuel);
    onChangeSeats(item.seats);
    onChangeAvailable(item.available);
    onChangePrice(item.price_per_day);
    onChangeVehicleType(item.vehicle_type_id);
    setUpdate(true);
  };

  useEffect(() => {
    assignVehicles();
    mapVehicleTypes();
  }, []);
  // end vehicle form

  //customers form
  const assignCustomers = async () => {
    var response = await getCustomers();
    setCustomers(response);
  };

  const [customerId, setCustomerId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cUpdate, setCUpdate] = useState(false);

  function handleCSubmit() {
    fetch(
      'http://localhost:3000/customers' + (cUpdate ? '/' + customerId : ''),
      {
        method: cUpdate ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: fullName,
          email: email,
          phone: phone,
        }),
      },
    ).then(async () => {
      setCustomers(await getCustomers());
    });
  }

  const handleCDelete = async (id: string) => {
    await fetch('http://localhost:3000/customers/' + id, {
      method: 'DELETE',
    }).then(async () => {
      setCustomers(await getCustomers());
    });
  };

  const handleCUpdate = async (item: Customer) => {
    setCustomerId(item.id);
    setFullName(item.fullname);
    setEmail(item.email);
    setPhone(item.phone);
    setCUpdate(true);
  };

  useEffect(() => {
    assignCustomers();
  }, []);

  //end customers form

  const [vId, setVId] = useState('');
  const [cId, setCId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerItems, setCustomerItems] = useState<Array<ItemType<string>>>(
    [],
  );
  const [openCustomerSelect, setCustomerSelectOpen] = useState(false);
  const [vehicleItems, setVehicleItems] = useState<Array<ItemType<string>>>([]);
  const [openVehicleSelect, setVehicleSelectOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  function handleEventSubmit() {
    fetch('http://localhost:3000/rental-events', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        customer_id: cId,
        vehicle_id: vId,
      }),
    }).then(async () => {
      let response = await fetch('http://localhost:3000/vehicles/' + vId, {
        method: 'GET',
      });
      let vehicle: Vehicle = await response.json();
      fetch('http://localhost:3000/vehicles/' + vehicle.id, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          available: ((vehicle.available as unknown as number) -
            1) as unknown as string,
        }),
      }).then(async () => {
        setVehicles(await getVehicles());
      });
    });
  }

  const calculateAvailable = async () => {
    let vehicle: Vehicle = await getVehicle(vId);

    let diff: number = differenceInDays(
      moment(startDate, 'DD/MM/YYYY'),
      moment(endDate, 'DD/MM/YYYY'),
    );

    let pricePerDay: number = vehicle.price_per_day as unknown as number;

    let totalPrice: number = diff * pricePerDay;

    let priceWithDiscount = totalPrice;
    console.log(diff);

    if (diff > 3 && diff <= 5) {
      priceWithDiscount = totalPrice - (totalPrice * 5) / 100;
    }

    if (diff > 5 && diff <= 10) {
      priceWithDiscount = totalPrice - (totalPrice * 7) / 100;
    }

    if (diff > 10) {
      priceWithDiscount = totalPrice - totalPrice / 10;
    }

    setTotalPrice(priceWithDiscount);
  };

  useEffect(() => {
    mapCustomers();
    mapVehicles();
    setCustomerItems(customersMapped);
    setVehicleItems(vehiclesMapped);
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={styles.viewStyleNoZ}>
            <Text>Brand:</Text>
            <TextInput value={brand} onChangeText={onChangeBrand} />

            <Text>Model:</Text>
            <TextInput value={model} onChangeText={onChangeModel} />

            <Text>Year of manufacture:</Text>
            <TextInput
              keyboardType="numeric"
              value={year}
              onChangeText={onChangeYear}
            />
            <Text>Fuel:</Text>
            <TextInput value={fuel} onChangeText={onChangeFuel} />

            <Text>Seats:</Text>
            <TextInput
              keyboardType="numeric"
              value={seats}
              onChangeText={onChangeSeats}
            />

            <Text>Price/day:</Text>
            <TextInput
              keyboardType="numeric"
              value={price}
              onChangeText={onChangePrice}
            />

            <Text>Available count:</Text>
            <TextInput
              keyboardType="numeric"
              value={available}
              onChangeText={onChangeAvailable}
            />
            <Text>Vehicle Type:</Text>
            <View
              style={{
                zIndex: 100,
              }}>
              <DropDownPicker
                open={open}
                value={vehicleType}
                items={items}
                setOpen={setOpen}
                setValue={onChangeVehicleType}
                setItems={setItems}
                style={{
                  zIndex: 100,
                  position: 'relative',
                }}
              />
            </View>
            <Button onPress={() => handleSubmit()} title="Submit form" />
          </View>
          <View style={styles.viewStyle}>
            <FlatList
              data={vehicles}
              keyExtractor={({id}) => id}
              renderItem={({item}) => (
                <>
                  <Text>
                    {item.brand} - {item.model} ({item.year}), {item.fuel},{' '}
                    {item.seats} seats. {item.price_per_day}lv/day -{' '}
                    {vehicleTypesMapped[item.vehicle_type_id]}. Available:{' '}
                    {item.available}
                  </Text>
                  <Button onPress={() => handleUpdate(item)} title="Update" />
                  <Button
                    onPress={() => handleDelete(item.id)}
                    title="Delete"
                  />
                </>
              )}
            />
          </View>
          <View style={styles.viewStyle}>
            <Text>Full Name:</Text>
            <TextInput value={fullName} onChangeText={setFullName} />
            <Text>Email:</Text>
            <TextInput value={email} onChangeText={setEmail} />
            <Text>Phone:</Text>
            <TextInput value={phone} onChangeText={setPhone} />
            <Button onPress={() => handleCSubmit()} title="Submit form" />
          </View>
          <View style={styles.viewStyle}>
            <FlatList
              data={customers}
              keyExtractor={({id}) => id}
              renderItem={({item}) => (
                <>
                  <Text>
                    {item.fullname}, Contact Info: {item.phone}; {item.email}
                  </Text>
                  <Button onPress={() => handleCUpdate(item)} title="Update" />
                  <Button
                    onPress={() => handleCDelete(item.id)}
                    title="Delete"
                  />
                </>
              )}
            />
          </View>
          <View style={styles.viewStyle}>
            <Text>Start Date:</Text>
            <TextInput value={startDate} onChangeText={setStartDate} />
            <Text>End Date:</Text>
            <TextInput value={endDate} onChangeText={setEndDate} />
            <Text>Select Customer:</Text>
            <View
              style={{
                zIndex: 20,
              }}>
              <DropDownPicker
                open={openCustomerSelect}
                value={cId}
                items={customerItems}
                setOpen={setCustomerSelectOpen}
                setValue={setCId}
                setItems={setCustomerItems}
                style={{
                  zIndex: 20,
                }}
              />
            </View>
            <Text>Select Vehicle:</Text>
            <View
              style={{
                zIndex: 30,
              }}>
              <DropDownPicker
                open={openVehicleSelect}
                value={vId}
                items={vehicleItems}
                setOpen={setVehicleSelectOpen}
                setValue={setVId}
                setItems={setVehicleItems}
                style={{
                  zIndex: 30,
                  position: 'relative',
                }}
                onChangeValue={calculateAvailable}
              />
            </View>
            <Text style={{fontWeight: 'bold'}}>
              {' '}
              Total cost:{' '}
              {
                /* differenceInDays(
                moment(startDate, 'DD/MM/YYYY'),
                moment(endDate, 'DD/MM/YYYY'),
              ) * 5 */ totalPrice
              }{' '}
              levs
            </Text>
            <Button onPress={() => handleEventSubmit()} title="Submit form" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewStyle: {flex: 1, padding: 24, zIndex: -5},
  viewStyleNoZ: {
    flex: 1,
    padding: 24,
  },
});

export default App;
