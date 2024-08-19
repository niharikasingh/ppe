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
  const [flexCapacity, setFlexCapacity] = useState(1);
  // number of covered people
  const [numFrontlineCovered, setNumFrontlinecovered] = useState(10);

  const BASELINE_PRODUCTION = 160000;

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
      <div style={{height: "98vh", verticalAlign: "top", width: "50%", display: "inline-block"}}>
        <div style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
          {[...Array(50)].map((y, i) =>
            <div style={{lineHeight: 0}}>
              {[...Array(20)].map((x, j) => 
                <Dot id={i*20 + j} color={dotColor(i*20 + j)} />
              )}
            </div>
          )}
        </div>
      </div>
      <div style={{height: "98vh", width: "50%", display: "inline-block", overflowY: "scroll"}}>
        <MantineProvider>
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
              label={<Text style={{marginTop: "-3px", marginBottom: "5px"}}>Only healthcare workers involved in the pandemic</Text>}
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165}
              onChange={() => setNumFrontlinecovered(10 + 165)}
              label={<Text style={{marginTop: "-3px", marginBottom: "5px"}}>Other healthcare practitioners</Text>}
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75)}
              label={<Text style={{marginTop: "-3px", marginBottom: "5px"}}>Healthcare support workers</Text>}
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55)}
              label={<Text style={{marginTop: "-3px", marginBottom: "5px"}}>First responders</Text>}
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55 + 205}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55 + 205)}
              label={<Text style={{marginTop: "-3px", marginBottom: "5px"}}>Food workers</Text>}
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55 + 205 + 140}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55 + 205 + 140)}
              label={<Text style={{marginTop: "-3px", marginBottom: "5px"}}>Transportation</Text>}
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55 + 205 + 140 + 110}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55 + 205 + 140 + 110)}
              label={<Text style={{marginTop: "-3px", marginBottom: "5px"}}>Manufacturing</Text>}
            />
            <Checkbox
              checked={numFrontlineCovered >= 10 + 165 + 75 + 55 + 205 + 140 + 110 + 240}
              onChange={() => setNumFrontlinecovered(10 + 165 + 75 + 55 + 205 + 140 + 110 + 240)}
              label={<Text style={{marginTop: "-3px", marginBottom: "5px"}}>Others (cleaning, maintenance, repair, construction)</Text>}
            />
          </Text>
          <Text>
            You need to cover <b>{numFrontlineCovered}</b> thousand workers. Let's choose some masks. Let's focus on the first 12 weeks of the pandemic. You will need {numMasksNeeded().toLocaleString()} masks.
          </Text>
          <Text>
            <b>How many workers are covered?</b>&nbsp;
            {/* TODO convert this to a percentage */}
            {numTypeAdjusted().toLocaleString()} masks are available, which is {checkNumType() ? "enough" : "not enough"}.
          </Text>
          <Text>
            <b>How much does this cost?</b>&nbsp;
            This will cost {(0.02*numTypeSurg + 0.25*numTypeDisp + 32.5*numTypeElas + 1114.48*numTypePapr).toLocaleString("default", { style: "currency", currency: "USD" })}.
          </Text>
          <Text mt="xl"><b>Surgical masks</b></Text>
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
            TODO explain dot colors 
            TODO add mask pictures 
          </Text>
          <Text mt="xl"><b>Disposable N95 masks</b></Text>
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
          <Text mt="xl"><b>Reusable elastomeric masks</b></Text>
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
          <Text mt="xl"><b>Reusable PAPR masks</b></Text>
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
          <Text mt="xl"><b>Stockpiling</b></Text>
          <Text>
            Broadly speaking, there are two ways to provide PPE to essential workers in the first weeks of a pandemic: stockpiling and flex capacity. 
          </Text>
          <Text>
            Stockpiling means keeping extra PPE in storage, to be used in case a pandemic happens. 
          </Text>
          <Text>
            Flex capacity means paying PPE producers to maintain the capability to increase their PPE production very quickly. In ordinary times, PPE producers can make {BASELINE_PRODUCTION.toLocaleString()} masks per day.  
          </Text>
          <Text>
            Based on your current parameters, you will need {Math.round(numMasksNeeded() / (12*7)).toLocaleString()} masks every day. 
          </Text>
          <Text mt="xl"><b>How much flex capacity do you want PPE producers to maintain?</b></Text>
          <Slider
            style={{width: '200px'}}
            min={1}
            max={10}
            label={(value) => `${value}x`}
            value={flexCapacity} onChange={setFlexCapacity}
            color="indigo"
            size="sm"
          />
          <Text>
            This will allow you to produce {(flexCapacity * BASELINE_PRODUCTION).toLocaleString()} masks using your flex capacity. Thus, you will need to stockpile {Math.max(Math.round((numMasksNeeded() / (12*7)) - (flexCapacity * BASELINE_PRODUCTION)), 0).toLocaleString()} masks.
          </Text>
          {/* TODO internal padding for text container */}
        </MantineProvider>
      </div>
    </>
    
  )
}

export default App;
