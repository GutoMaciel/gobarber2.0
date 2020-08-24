import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';


import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment, Section, Appointment } from './styles';

import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, [])

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      },
    }).then(response => {
      setMonthAvailability(response.data);
    })
  }, [currentMonth, user.id]);

  const disableDays = useMemo(() => {
    const dates = monthAvailability.filter(monthDay => monthDay.available === false).map(monthDay => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      return new Date(year, month, monthDay.day);
    });

    return dates;
  }, [currentMonth, monthAvailability])

  return (
      <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber"/>

          <Profile>
            <img src={user.avatar_url} alt={user.name}/>
            <div>
              <span>Welcome,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Appointments</h1>
          <p>
            <span>Today</span>
            <span>Tomorrow</span>
            <span>Monday</span>
          </p>
          <NextAppointment>
            <strong>Next appointment:</strong>
            <div>
              <img src="https://avatars0.githubusercontent.com/u/54125353?s=460&u=c3ebb344eb38b821924e1b16f35fe597fc8768e5&v=4" alt="GuCustomer"/>
              <strong>Gustavo Maciel</strong>
              <span>
                <FiClock/>
                08h00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Morning</strong>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
              <img src="https://avatars0.githubusercontent.com/u/54125353?s=460&u=c3ebb344eb38b821924e1b16f35fe597fc8768e5&v=4" alt="GuCustomer"/>
              <strong>Gustavo Maciel</strong>
              </div>
            </Appointment>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
              <img src="https://avatars0.githubusercontent.com/u/54125353?s=460&u=c3ebb344eb38b821924e1b16f35fe597fc8768e5&v=4" alt="GuCustomer"/>
              <strong>Gustavo Maciel</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Afternoon</strong>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
              <img src="https://avatars0.githubusercontent.com/u/54125353?s=460&u=c3ebb344eb38b821924e1b16f35fe597fc8768e5&v=4" alt="GuCustomer"/>
              <strong>Gustavo Maciel</strong>
              </div>
            </Appointment>
          </Section>

        </Schedule>
        <Calendar>
          <DayPicker
            fromMonth={new Date()}
            disabledDays={[
              { daysOfWeek: [0, 6]}, ...disableDays
            ]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5]}
            }}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            onMonthChange={handleMonthChange}

          />
        </Calendar>
      </Content>
    </Container>
  );
}

export default Dashboard;
