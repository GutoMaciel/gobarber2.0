import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Platform, Alert} from 'react-native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  BackButton,
  UserAvatar,
  ProvidersList,
  ProvidersListContainer,
  ProviderAvatar,
  ProviderContainer,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
  CreateAppointmentButton,
  CreateAppointmentButtonText
} from './styles';
interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user} = useAuth();
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  useEffect(() => {
    api.get('providers').then((response) => {
      setProviders(response.data);
    });
  }, []);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  useEffect(() => {
    api.get(`providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    }).then(response => {
      setAvailability(response.data);
    })
  },[selectedDate, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour < 12)
      .map(({ hour, available}) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      })

  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour >= 12)
      .map(({ hour, available}) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      })

  }, [availability]);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      })

      navigate('AppointmentCreated', { date: date.getTime() })
    } catch (err) {
      Alert.alert(
        'Error', 'Try again, please.'
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <UserAvatar source={{ uri: user.avatar_url}}></UserAvatar>
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider}) => (
              <ProviderContainer onPress={() => handleSelectProvider(provider.id)} selected={provider.id === selectedProvider}>
                <ProviderAvatar source={{ uri: provider.avatar_url}} />
                <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
            </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
        <Calendar>
          <Title>Choose the date</Title>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>Select other date</OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker mode="date" display="calendar" onChange={handleDateChange} textColor="#f4ede8" value={selectedDate} />
          )}
        </Calendar>

            <Schedule>
              <Title>Choose a time</Title>
              <Section>
                <SectionTitle>Morning</SectionTitle>
                <SectionContent>
                    {morningAvailability.map(( {hourFormatted, hour, available}) => (
                      <Hour
                        enabled={available}
                        selected={selectedHour === hour}
                        available={available}
                        onPress={() => handleSelectHour(hour)}
                        key={hourFormatted}>
                        <HourText>{hourFormatted}</HourText>
                      </Hour>
                    ))}
                </SectionContent>
              </Section>

              <Section>
                <SectionTitle>Afternoon</SectionTitle>
                <SectionContent>
                  {afternoonAvailability.map(( {hourFormatted, hour, available}) => (
                    <Hour
                      enabled={available}
                      selected={selectedHour === hour}
                      available={available}
                      onPress={() => handleSelectHour(hour)}
                      key={hourFormatted}>
                      <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                    </Hour>
                  ))}
                </SectionContent>
              </Section>
            </Schedule>

            <CreateAppointmentButton onPress={handleCreateAppointment}>
              <CreateAppointmentButtonText>Schedule</CreateAppointmentButtonText>
            </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
