import { useAuth } from '@clerk/clerk-expo'
import { View, Text, ScrollView, Pressable } from 'react-native'

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "person-outline", label: "Edit Profile", color: "#F4A261" },
      { icon: "shield-checkmark-outline", label: "Privacy & Security", color: "#10B981" },
      { icon: "notifications-outline", label: "Notifications", value: "On", color: "#8B5CF6" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: "moon-outline", label: "Dark Mode", value: "On", color: "#6366F1" },
      { icon: "language-outline", label: "Language", value: "English", color: "#EC4899" },
      { icon: "cloud-outline", label: "Data & Storage", value: "1.2 GB", color: "#14B8A6" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help-circle-outline", label: "Help Center", color: "#F59E0B" },
      { icon: "chatbubble-outline", label: "Contact Us", color: "#3B82F6" },
      { icon: "star-outline", label: "Rate the App", color: "#F4A261" },
    ],
  },
];

const ProfileTab = () => {
  const { signOut} = useAuth();

  return (
     <ScrollView className='bg-surface'
        contentInsetAdjustmentBehavior='automatic'
       >
         <Text className='text-white'>ProfileTab</Text>
         <Pressable 
          onPress={() => signOut()}
          className='mt-4 bg-red-600 px-4 py-2 rounded-lg'
          >
            <Text>Sign Out</Text>
          </Pressable>
       </ScrollView>
  )
}

export default ProfileTab