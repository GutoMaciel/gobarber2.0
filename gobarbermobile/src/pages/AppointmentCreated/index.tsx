import React, {useMemo} from 'react';
// import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

import { Container, Title, Description, OkButton, OkButtonText } from './styles';
import { useCallback } from 'react';
interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as RouteParams;

  const handleOkPress = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard'}],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    return format(routeParams.date, "EEEE', 'MMMM', 'dd', 'yyyy', at 'HH:mm'.'")
  }, [routeParams.date])

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title>Appointment Scheduled!</Title>
      <Description>{formattedDate}</Description>
      <OkButton onPress={handleOkPress}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
