import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
   const [currentTime, setCurrentTime] = useState<string>(getFormattedTime());
   const [intervalSeconds, setIntervalSeconds] = useState<number>(40); // Начальное значение интервала
   const [isTimerActive, setIsTimerActive] = useState<boolean>(false); // Состояние активности таймера
   const [alarmColor, setAlarmColor] = useState<string>('');
   const [countdown, setCountdown] = useState<string>('');

   // Отдельный useEffect для обновления текущего времени каждую секунду
   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentTime(getFormattedTime());
      }, 1000);

      return () => clearInterval(timer);
   }, []); // Пустой массив зависимостей, чтобы этот useEffect запускался только при монтировании компонента

   useEffect(() => {
      let timer: ReturnType<typeof setInterval>;
      if (isTimerActive) {
         const startDate = new Date();
         let nextAlarm = new Date(startDate.getTime() + intervalSeconds * 1000);

         timer = setInterval(() => {
            const now = new Date();
            const timeToAlarm = nextAlarm.getTime() - now.getTime();
            if (timeToAlarm <= 0) {
               nextAlarm = new Date(now.getTime() + intervalSeconds * 1000);
               setAlarmColor('red');
               setTimeout(() => setAlarmColor(''), 1000);
            } else if (timeToAlarm <= 10000) {
               setAlarmColor('orange');
            }
            const countdownTime = new Date(timeToAlarm);
            setCountdown(`${countdownTime.getUTCHours()}:${countdownTime.getUTCMinutes()}:${countdownTime.getUTCSeconds()}`);
         }, 1000);
      }

      return () => {
         if (timer) clearInterval(timer);
      };
   }, [isTimerActive, intervalSeconds]);

   const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIntervalSeconds(Number(event.target.value));
   };

   const handleTimerToggle = () => {
      setIsTimerActive(!isTimerActive); // Переключение состояния активности таймера
   };

   return (
      <div>
         <h2 style={{ color: alarmColor }}>Текущее время: {currentTime}</h2>
         <div>До следующего обновления: {countdown}</div>
         <label>
            Введите интервал для таймера (в секундах):
            <input type="number" value={intervalSeconds} onChange={handleIntervalChange} />
         </label>
         <br />
         <button onClick={handleTimerToggle}>
            {isTimerActive ? 'Остановить таймер' : 'Запустить таймер'}
         </button>
      </div>
   );
};

function getFormattedTime(date: Date = new Date()): string {
   return date.toTimeString().split(' ')[0];
}

export default Timer;
