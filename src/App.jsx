import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import { Slider, Text } from '@mantine/core';
import './App.css'
import '@mantine/core/styles.css';

// TODO page title
// TODO deploy online -- need to split into tasks

function App() {
  // types of masks 
  const [numTypeDisp, setNumTypeDisp] = useState(0);
  const [numTypeElas, setNumTypeElas] = useState(0);
  const [numTypePapr, setNumTypePapr] = useState(0);

  function numTypeAdjusted() {
    // convert all masks to disposable n95 masks
    let numTypeElasAdjusted = numTypeElas * 1600;
    let numTypePaprAdjusted = numTypePapr * 4 * 1600;
    return numTypeDisp + numTypeElasAdjusted + numTypePaprAdjusted;
  }

  function checkNumType() {
    return numTypeAdjusted() >= 6000000;
  }

  return (
    <MantineProvider>
      <Text>
        <b>How many HCWs are covered?</b>&nbsp;
        {/* TODO convert this to a percentage */}
        {Math.round(numTypeAdjusted()/10000)/100}M masks are available, which is {checkNumType() ? "enough" : "not enough"}.
      </Text>
      <Text>
        <b>How much does this cost?</b>&nbsp;
        {/* TODO add commas to $ number */}
        This will cost ${0.25*numTypeDisp + 32.5*numTypeElas + 1114.48*numTypePapr}.
      </Text>
      {/* TODO left align text for sliders*/}
      <Text size="sm" mt="xl">Disposable masks</Text>
      <Slider
        style={{width: '200px'}}
        min={0}
        max={6000000}
        label={(value) => value ? `${Math.round(value/10000)/100}M` : "0"}
        value={numTypeDisp} onChange={setNumTypeDisp}
        color="indigo"
        size="sm"
      />
      <Text size="sm" mt="xl">Reusable elastomeric masks</Text>
      <Slider
        style={{width: '200px'}}
        min={0}
        max={10000}
        label={(value) => value ? `${Math.round(value/10)/100}k` : "0"}
        value={numTypeElas} onChange={setNumTypeElas}
        color="indigo"
        size="sm"
      />
      <Text size="sm" mt="xl">Reusable PAPR masks</Text>
      <Slider
        style={{width: '200px'}}
        min={0}
        max={2500}
        label={(value) => value ? `${Math.round(value/10)/100}k` : "0"}
        value={numTypePapr} onChange={setNumTypePapr}
        color="indigo"
        size="sm"
      />
    </MantineProvider>
  )
}

export default App;
