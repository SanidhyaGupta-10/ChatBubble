import { Redirect } from 'expo-router';
import { View, Text } from 'react-native'

const AuthLayout = () => {

  const isAuth = true;
  if(isAuth) return <Redirect  href={"/(tabs)"}/>

  return (
    <View className='mt-20 flex-1'>
      <Text>AuthLayout</Text>
    </View>
  )
}

export default AuthLayout