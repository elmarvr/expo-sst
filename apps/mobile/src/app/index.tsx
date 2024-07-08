import { Checkbox } from '@acme/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView>
      <Checkbox value="test">
        <Checkbox.Indicator>
          <Checkbox.Icon />
        </Checkbox.Indicator>
      </Checkbox>
    </SafeAreaView>
  );
}
