import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

/** Chỉ vẽ QR từ payload đã được server/shared sinh ra; không chứa logic VietQR. */
export function VietQRViewer({ value, size = 240 }: { value: string; size?: number }) {
  return (
    <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 12, alignSelf: 'center' }}>
      <QRCode value={value} size={size} ecl="M" />
    </View>
  );
}
