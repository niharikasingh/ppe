import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import { Checkbox, Slider, Text } from '@mantine/core';
import './App.css'
import '@mantine/core/styles.css';

function Dot(props) {
  const { id, color } = props;

  return (
    <>
      <div style={{height: "0.98vh", width: "0.98vh", backgroundColor: color, borderRadius: "50%", display: "inline-block"}}></div>
    </>
  )
}

// TODO page title
// TODO deploy online -- need to split into tasks

function App() {
  // types of masks 
  const [numTypeSurg, setNumTypeSurg] = useState(0);
  const [numTypeDisp, setNumTypeDisp] = useState(0);
  const [numTypeElas, setNumTypeElas] = useState(0);
  const [numTypePapr, setNumTypePapr] = useState(0);
  // number of covered people
  const [numFrontlineCovered, setNumFrontlinecovered] = useState(10);

  function numTypeAdjusted() {
    // convert all masks to disposable n95 masks
    let numTypeElasAdjusted = numTypeElas * 1600;
    let numTypePaprAdjusted = numTypePapr * 4 * 1600;
    return numTypeSurg + numTypeDisp + numTypeElasAdjusted + numTypePaprAdjusted;
  }

  const MAX_MASKS = 600000000;
  function numMasksNeeded(numPeople = null) {
    return 6000000 * ((numPeople ?? numFrontlineCovered) / 10);
  }

  function checkNumType() {
    return numTypeAdjusted() >= numMasksNeeded();
  }

  function dotColor(dotId) {
    if (dotId < numFrontlineCovered) {
      if (numMasksNeeded(dotId) < numTypeAdjusted()) {
        // covered by masks
        if (numMasksNeeded(dotId) >= (numTypeAdjusted() - numTypeSurg)) {
          return "yellow"
        } else {
          return "green";
        }
      } else {
        return "darkgray";
      }
    };
    return "lightgray";
  }

  return (
    <>
      {/* TODO center the dots vertically*/}
      <div style={{maxHeight: "98vh", width: "50%", display: "inline-block"}}>
        {[...Array(50)].map((y, i) =>
          <div style={{lineHeight: 0}}>
            {[...Array(20)].map((x, j) => 
              <Dot id={i*20 + j} color={dotColor(i*20 + j)} />
            )}
          </div>
        )}
      </div>
      <div style={{height: "98vh", width: "50%", display: "inline-block", overflowY: "scroll"}}>
        <MantineProvider>
          {/* TODO style the text properly: not centered, paragraph breaks */}
          <Text>
            Each dot <Dot color="darkgray"></Dot> is a thousand people.
          </Text>
          <Text>
            All the dots represent the million frontline essential workers the US has. These are people who need to go to their jobs in person every day to keep our society running. 
          </Text>
          <Text>
            In a pandemic, all these people will need personal protective equipment (PPE) so they can feel safe doing their jobs.
          </Text>
          <Text>
            However, this will not be easy. Let's see why. Assume that it is your job to distribute PPE to people. 
          </Text>
          <Text>
            First, how many frontline essential workers will you provide PPE to?
          </Text>
          <Text>
            <Checkbox
              checked={numFrontlineCovered >= 10}
              onChange={() => setNumFrontlinecovered(10)}
              label="Only healthcare workers involved in the pandemic"
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165}
              onChange={() => setNumFrontlinecovered(10 + 165)}
              label="Other healthcare practitioners"
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75)}
              label="Healthcare support workers"
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55)}
              label="First responders"
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55 + 205}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55 + 205)}
              label="Food workers"
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55 + 205 + 140}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55 + 205 + 140)}
              label="Transportation"
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55 + 205 + 140 + 110}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55 + 205 + 140 + 110)}
              label="Manufacturing"
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55 + 205 + 140 + 110 + 240}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55 + 205 + 140 + 110 + 240)}
              label="Others (cleaning, maintenance, repair, construction)"
            />
          </Text>
          <Text>
            You need to cover <b>{numFrontlineCovered}</b> thousand workers. Let's choose some masks. Let's focus on the first 12 weeks of the pandemic. You will need {numMasksNeeded()} masks.
          </Text>
          <Text>
            <b>How many HCWs are covered?</b>&nbsp;
            {/* TODO convert this to a percentage */}
            {Math.round(numTypeAdjusted()/10000)/100}M masks are available, which is {checkNumType() ? "enough" : "not enough"}.
          </Text>
          <Text>
            <b>How much does this cost?</b>&nbsp;
            {/* TODO add commas to $ number */}
            This will cost ${0.02*numTypeSurg + 0.25*numTypeDisp + 32.5*numTypeElas + 1114.48*numTypePapr}.
          </Text>
          {/* TODO left align text for sliders*/}
          <Text size="sm" mt="xl">Surgical masks</Text>
          <Slider
            style={{width: '200px'}}
            min={0}
            max={MAX_MASKS}
            label={(value) => value ? `${Math.round(value/10000)/100}M` : "0"}
            value={numTypeSurg} onChange={setNumTypeSurg}
            color="indigo"
            size="sm"
          />
          <Text>
            Surgical masks are extremely cheap. However, they require a lot of space to stockpile in advance. They will need to be stockpiled in very large warehouses, and then after a pandemic hits, distributed to areas of need. This will be a logistically challenging operation. 
          </Text>
          <Text>
            Moreover, these masks can only be used in proximity to a sick person for about an hour before the risk of catching the infection becomes high. 
          </Text>
          <Text size="sm" mt="xl">Disposable N95 masks</Text>
          <Slider
            style={{width: '200px'}}
            min={0}
            max={MAX_MASKS}
            label={(value) => value ? `${Math.round(value/10000)/100}M` : "0"}
            value={numTypeDisp} onChange={setNumTypeDisp}
            color="indigo"
            size="sm"
          />
          <Text>
            These masks offer better protection than surgical masks, but otherwise have similar drawbacks. They are about 10x the cost of surgical masks. 
          </Text>
          <Text size="sm" mt="xl">Reusable elastomeric masks</Text>
          <Slider
            style={{width: '200px'}}
            min={0}
            max={MAX_MASKS / 600}
            label={(value) => value ? `${Math.round(value/10)/100}k` : "0"}
            value={numTypeElas} onChange={setNumTypeElas}
            color="indigo"
            size="sm"
          />
          <Text>
            These masks offer extremely good protection. To be used correctly, their fit needs to be tested to make sure it forms a tight seal and their filter cartidges need to be replaced about once a week. They are about 100x the cost of N95 masks. 
          </Text>
          <Text size="sm" mt="xl">Reusable PAPR masks</Text>
          <Slider
            style={{width: '200px'}}
            min={0}
            max={MAX_MASKS / 2400}
            label={(value) => value ? `${Math.round(value/10)/100}k` : "0"}
            value={numTypePapr} onChange={setNumTypePapr}
            color="indigo"
            size="sm"
          />
          <Text>
            These masks offer extremely good protection. They also don't require fit testing to be used correctly. They can be used by people who cannot wear other kinds of masks due to head coverings. They take a long time to put on, and require assistance from others during the donning and doffing process. They are about 35X the cost of elastomeric masks. 
          </Text>
          <Text>
            Zooming out, you should remember that the above exercise doesn't capture the true need for masks. Worldwide, there are 25M frontline essential workers who will need masks. Only 1M of these are in the US. 
          </Text>
          <Text>
            Also, the above exercise only focuses on 12 weeks of a pandemic. Real pandemics can last much longer. 
          </Text>
        </MantineProvider>
      </div>
    </>
    
  )
}

export default App;
