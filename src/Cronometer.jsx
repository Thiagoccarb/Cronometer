import React from 'react';
import './Cronometer.css';
import audio from './Musics/waves.mp3';

class Cronometer extends React.Component {
  constructor() {
    super()
    this.state = {
      seconds: '',
      minutes: '',
      hours: '',
      pauseCronometer: false,
      invalidSec: false,
      invalidMin: false,
      isCronometerRunning: false,
      music: new Audio(audio),
      playMusic: false,
    }
  }

  playAudio = () => {
    const { music } = this.state;
    music.loop = true;
    return music.play();
  };

  stopAudio = () => {
    const { music } = this.state;
    music.currentTime = 0;
    return music.pause();
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    })
  }

  startCronometer = () => {
    const { seconds, minutes, isCronometerRunning, pauseCronometer } = this.state;
    const ONE_SECOND = 1000;
    if (pauseCronometer) {
      this.setState({ pauseCronometer: false });
      return this.cronometerInterval = setInterval(() => {
        this.setState((prevState) => ({ seconds: prevState.seconds - 1 }));
      }, ONE_SECOND);
    }

    if (Number(seconds) >= 60) {
      return this.setState({ invalidSec: true });
    } else {
      this.setState({ invalidSec: false });
    }
    if (Number(minutes) >= 60) {
      return this.setState({ invalidMin: true });
    } else {
      this.setState({ invalidMin: false });
    }

    if (!isCronometerRunning) {
      this.cronometerInterval = setInterval(() => {
        this.setState((prevState) => ({ seconds: prevState.seconds - 1, isCronometerRunning: true }));
      }, ONE_SECOND);
    }
  }

  clear = () => {
    this.setState({
      hours: '',
      minutes: '',
      seconds: '',
      pauseCronometer: false,
      invalidSec: false,
      invalidMin: false,
      isCronometerRunning: false,
      playMusic: false,
    });
    return clearInterval(this.cronometerInterval);
  }

  pauseCronometer = () => {
    this.setState({
      pauseCronometer: true,
    });

    return clearInterval(this.cronometerInterval);
  }

  componentDidUpdate() {
    const { seconds, minutes, hours, playMusic } = this.state;
    playMusic ? this.playAudio() : this.stopAudio();
    const numberSec = seconds ? Number(seconds) : 0;
    const numberMin = minutes ? Number(minutes) : 0;
    const numberHour = hours ? Number(hours) : 0;
    if (numberSec === 0 && numberMin === 0 && numberHour === 0) {
      clearInterval(this.cronometerInterval)
    }
    if (numberHour === 0 && numberMin >= 1 && numberSec === 0) {
      this.setState((prevState) => ({
        seconds: 59,
        minutes: prevState.minutes - 1,
      }))
    }
    if (numberHour >= 1 && numberMin === 0 && numberSec === 0) {
      this.setState((prevState) => ({
        seconds: 59,
        minutes: 59,
        hours: prevState.hours - 1,
      }))
    }

    if (numberHour >= 1 && numberMin >= 1 && numberSec === 0) {
      this.setState((prevState) => ({
        seconds: 59,
        minutes: prevState.minutes - 1,
      }))
    }
  }

  render() {
    const { seconds, minutes, hours, invalidSec,
      invalidMin, isCronometerRunning, playMusic
    } = this.state;
    const displayedSec = seconds > 9 ? seconds : `0${seconds}`;
    const displayedMin = minutes > 9 ? minutes : `0${minutes}`;

    return (
      <div
        className="cronometer"
      >
        <div
          className="inputs"
          id={isCronometerRunning ? "running" : null}

        >
          <input
            type="number"
            value={hours}
            name="hours"
            min={0}
            max={59}
            onChange={this.handleChange}
            placeholder="hr"
          />
          <input
            type="number"
            value={minutes}
            name="minutes"
            min={0}
            max={59}
            onChange={this.handleChange}
            placeholder="min"
            style={invalidMin ? { border: '5px solid red' } : null}
          />
          <input
            type="number"
            value={seconds}
            name="seconds"
            min={0}
            max={59}
            onChange={this.handleChange}
            placeholder="sec"
            style={invalidSec ? { border: '5px solid red' } : null}
          />
        </div>
        <div
          className="buttons"
          style={isCronometerRunning ? { marginTop: '250px' } : null}
        >
          <button
            disabled={(seconds === '' || minutes === '' || hours === '')}
            onClick={this.startCronometer}
          >
            {isCronometerRunning ? 'continue' : 'start'}
          </button>
          <button
            disabled={!isCronometerRunning}
            onClick={this.pauseCronometer}
          >
            pause
          </button>
          <button
            onClick={this.clear}
          >
            clear
          </button>
          <button
            onClick={async () => {
              this.setState({ playMusic: !playMusic })
            }}
          >
            {playMusic ? 'sound on' : 'sound off'}
          </button>
        </div>
        {invalidMin || invalidSec ? <h2>Please, enter a valid time format.</h2> : null}
        {isCronometerRunning ? <h3>{`${hours}:${displayedMin}:${displayedSec}`}</h3> : null}
      </div>
    )
  }
}

export default Cronometer;

