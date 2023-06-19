import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, DeviceInfo } from 'react-native';
import * as Location from 'expo-location'; // gps 라이브러리
import * as SMS from 'expo-sms'; // 문자 라이브러리

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState(null);

  // gps권한 가져오기
  const get_Permission_GPS = useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한이 거부되었습니다', 'GPS를 사용하려면 권한이 필요합니다');
      }else{
        Alert.alert('gps권한을 허락합니다.');
      }
    } catch (error) {
      console.error('GPS권한 오류 : ', error);
    }
  };

  // 위치정보 가져오기
  const getLocation = async () => {
    console.log(DeviceInfo);
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      setLocation(coords);
      console.log("위도 : "+coords.latitude+"\n 경도 : "+coords.longitude);
      Alert.alert("위도 : "+coords.latitude+"\n 경도 : "+coords.longitude);
    } catch (error) {
      console.error('위치 권한 오류 : ', error);
    }
  };

  // 문자 보내기
  const sendSMS = async () => {
    if (!phoneNumber || !location) {
      Alert.alert('오류', '전화번호를 입력하고 위치를 확인해 주세요.');
            return;
    }

    // 문자 기능 사용가능 확인
    SMS.isAvailableAsync().then(result => {
      if (result) {
        Alert.alert('SMS 사용가능');
      }else{
        Alert.alert('SMS 사용 불가능');
      }
    }).catch(error => {
      Alert.alert("SMS오류 : "+error);
    });


    const { latitude, longitude } = location;
    const message = `내 현재(${phoneNumber}) 위치는 위도: ${latitude}, 경도: ${longitude}`;

    try {
      const { result } = await SMS.sendSMSAsync([phoneNumber], message);

      if (result === SMS.SentStatus.sent) {
        Alert.alert('문자보내기', '위치가 문자를 통해 전송되었습니다.');
      } else {
        Alert.alert('문자 오류', '문자를 보내는데 실패하였습니다.');
      }
    } catch (error) {
      console.error('문자 오류 : ', error);
      Alert.alert('문자 오류', '문자를 보내는데 실패하였습니다.');
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>핸드폰 번호 입력</Text>
      <TextInput
        style={{ flex: 0, width: 150, height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, textAlign: 'center' }}
        onChangeText={text => setPhoneNumber(text)}
        value={phoneNumber}
      />
      
      <Button title='GPS 권한 확인' oonPress={get_Permission_GPS}></Button>
      <Button title="위치 확인" onPress={getLocation} />
      <Button title="문자 보내기" onPress={sendSMS} />
    </View>
  );
};

export default App;