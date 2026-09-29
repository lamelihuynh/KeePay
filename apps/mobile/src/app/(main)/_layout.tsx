import { Tabs } from 'expo-router';

export default function MainLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Nhóm' }} />
      <Tabs.Screen name="friends" options={{ title: 'Bạn bè' }} />
      <Tabs.Screen name="profile" options={{ title: 'Cá nhân' }} />
    </Tabs>
  );
}
