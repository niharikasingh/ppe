import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import { Checkbox, Slider, Text } from '@mantine/core';
import './App.css'
import '@mantine/core/styles.css';
import elastomericUrl from './assets/elastomeric.jpg';
import n95Url from './assets/n95.jpeg';
import paprUrl from './assets/papr.png';
import surgicalUrl from './assets/surgical.png';


function Dot(props) {
  const { id, color, br="0px" } = props;

  return (
    <>
      <div style={{height: "0.98vh", width: "0.98vh", backgroundColor: color, borderRadius: "50%", display: "inline-block", borderColor: "white", borderWidth: br, borderStyle: "solid"}}></div>
    </>
  )
}

// TODO loom video and submit 

function App() {
  // types of masks 
  const [numTypeSurg, setNumTypeSurg] = useState(0);
  const [numTypeDisp, setNumTypeDisp] = useState(0);
  const [numTypeElas, setNumTypeElas] = useState(0);
  const [numTypePapr, setNumTypePapr] = useState(0);
  const [flexCapacity, setFlexCapacity] = useState(0);
  // number of covered people, needs to be multiplied by 55000
  const [numFrontlineCovered, setNumFrontlinecovered] = useState(10);

  const PAPR_REUSE_FACTOR = 3;
  const NUM_DAYS = 100; // roughly 12 weeks 
  const MAX_MASKS = 55000000 * NUM_DAYS;
  const BASELINE_PRODUCTION = 5500*NUM_DAYS;

  function numTypeAdjusted() {
    // convert all masks to disposable n95 masks
    let numTypeElasAdjusted = numTypeElas * NUM_DAYS;
    let numTypePaprAdjusted = numTypePapr * PAPR_REUSE_FACTOR * NUM_DAYS;
    return numTypeSurg + numTypeDisp + numTypeElasAdjusted + numTypePaprAdjusted;
  }


  function numMasksNeeded(dotId = null) {
    return NUM_DAYS * ((dotId ?? numFrontlineCovered) * 55000);
  }

  function checkNumType() {
    return numTypeAdjusted() >= numMasksNeeded();
  }

  function dotColor(dotId) {
    if (dotId < numFrontlineCovered) {
      if (numMasksNeeded(dotId) < numTypeAdjusted()) {
        // covered by masks
        if (numMasksNeeded(dotId) >= (numTypeAdjusted() - numTypeSurg)) {
          return "goldenrod"
        } else {
          return "green";
        }
      } else {
        return "darkgray";
      }
    };
    return "lightgray";
  }

  function dotBorder(dotId) {
    if (dotId < numFrontlineCovered) {
      if (numMasksNeeded(dotId) < numTypeAdjusted()) {
        // covered by flex capacity
        if (numMasksNeeded(dotId) < (BASELINE_PRODUCTION * NUM_DAYS * flexCapacity)) {
          return "2px"
        } else {
          return "0px";
        }
      } else {
        return "0px";
      }
    };
    return "0px";
  }

  return (
    <>
      <div style={{height: "98vh", verticalAlign: "top", width: "50%", display: "inline-block"}}>
        <div style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
          {[...Array(50)].map((y, i) =>
            <div style={{lineHeight: 0}}>
              {[...Array(20)].map((x, j) => 
                <Dot id={i*20 + j} color={dotColor(i*20 + j)} br={dotBorder(i*20 + j)} />
              )}
            </div>
          )}
        </div>
      </div>
      <div style={{height: "98vh", width: "50%", display: "inline-block", overflowY: "scroll", padding: "0px 10px"}}>
        <MantineProvider>
          <h2>PPE Explainer</h2>
          <h5>Written by Neha Singh in August 2024</h5>
          <Text>
            If another pandemic like Covid-19 happens, we will need to use many strategies to fight it. Some of these strategies will depend on the exact kind of pandemic it is. For example, vaccines will need to be developed to specifically target the pathogen. Medicines and medical protocols will also need to be tailored to the symptoms the pathogen causes.  
          </Text>
          <Text>
            However, there is one strategy for fighting pandemics that doesn't depend on the details of the pandemic: personal protective equipment, or PPE. PPE includes items like gloves, masks, eyewear, face shields, and gowns. All these items have one function: to keep pathogens away from their wearer. PPE forms a physical barrier that stops pathogens from coming into contact with people, and thus stops people from getting infected. 
          </Text>
          <Text>
            Because PPE doesn't need to be tailored to match a pathogen, it offers a huge advantage: it can be prepared in advance. We can stockpile PPE <i>now</i> to be used in case of a pandemic, and incentivize manufacturers <i>now</i> to be ready to produce lots of PPE.  
          </Text>
          <Text>
            Let's consider how PPE could be used in case of a potential future pandemic. In a pandemic, the first order of business will be to keep society running until we find a cure for the pandemic. This means essential workers will need to keep working. They will only do this if they feel safe that they won't get infected while working, which is where PPE can help. 
          </Text>
          <Text>
            We will focus on the trickiest type of PPE: masks. Masks are tricky because they only work well when they fit their wearer's face extremely well, as opposed to gowns or gloves which have more of a margin of error. Masks are also tricky because they can't be made of a complete barrier, like rubber gloves or plastic face shields. Instead, they need to allow air through while filtering out pathogens. If we face difficulties manufacturing or procuring PPE, they'll likely show up in masks.
          </Text>
          <Text>
            The dots on the left represent the roughly 55 million frontline essential workers the US has. Each dot <Dot color="darkgray"></Dot> is 55 thousand people. These are people who need to go to their jobs in person every day to keep our society running. 
          </Text>
          <Text>
            Assume that it is your job to distribute PPE to people. Which frontline essential workers will you provide PPE to?
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
            You need to cover <b>{(numFrontlineCovered * 55000).toLocaleString()}</b> workers. Let's focus on the first 12 weeks of the pandemic. 
          </Text>
          <Text>
            Let's use a unit called <b>mask-days</b>. If you give a worker a disposable mask, they will need a new mask every day. If you give a worker a reusable mask, they can use that same mask for many weeks. In any case, regardless of the actual number of masks used, the worker will need to be covered for 84 mask-days (1 person needing coverage * 12 weeks * 7 days). A reusable mask provides protection for more mask-days than a disposable mask. 
          </Text>
          <Text>
            Given your selections above, you need to cover people for <b>{numMasksNeeded().toLocaleString()}</b> mask-days. You can select different types of masks below to cover these people. 
          </Text>
          <div>
            <Text style={{position: "sticky", top: 0, backgroundColor: "rgb(215, 246, 215)", zIndex: 999}}>
              <b>How many workers are covered?</b>&nbsp;
              {numTypeAdjusted().toLocaleString()} masks-days are available, which is {Math.round(numTypeAdjusted()*100/numMasksNeeded()).toLocaleString()}% of mask-days required, which is <b>{checkNumType() ? <span style={{color: "green"}}>enough</span> : <span style={{color: "red"}}>not enough</span>}</b>.
              <br />
              <b>How much does this cost?</b>&nbsp;
              This will cost ${Math.round((0.02*numTypeSurg + 0.25*numTypeDisp + 32.5*numTypeElas + 1114.48*numTypePapr)/1000000).toLocaleString()}M, which is {Math.round((0.02*numTypeSurg + 0.25*numTypeDisp + 32.5*numTypeElas + 1114.48*numTypePapr) * 100 / 325000000000)}% of the amount the US spends on fire and firefighting (~$325B).
            </Text>
            <Text mt="xl"><b>Surgical masks</b></Text>
            <Slider
              style={{width: '200px', marginLeft: '20px'}}
              min={0}
              max={MAX_MASKS}
              label={(value) => value ? `${Math.round(value/10000)/100}M` : "0"}
              value={numTypeSurg} onChange={setNumTypeSurg}
              color="indigo"
              size="sm"
            />
            <img src={surgicalUrl} style={{width: "200px", float: "left"}} />
            <Text>
              Surgical masks are extremely cheap. However, they require a lot of space to stockpile in advance. If a pandemic hits, they will need to be distributed to areas of need; this will be a logistically challenging operation. 
            </Text>
            <Text>
              Moreover, these masks can only be used in proximity to a sick person for about an hour before the risk of catching the infection becomes unacceptably high. Because these masks will not fully protect workers, they are shown in <span style={{color: "goldenrod"}}><b>yellow</b></span>. All the below masks, which protect workers much better are shown in <span style={{color: "green"}}><b>green</b></span>.
            </Text>
            <Text mt="xl"><b>Disposable N95 masks</b></Text>
            <Slider
              style={{width: '200px', marginLeft: '20px'}}
              min={0}
              max={MAX_MASKS}
              label={(value) => value ? `${Math.round(value/10000)/100}M` : "0"}
              value={numTypeDisp} onChange={setNumTypeDisp}
              color="indigo"
              size="sm"
            />
            <img src={n95Url} style={{width: "200px", float: "left"}} />
            <Text>
              These masks offer better protection than surgical masks. However, they have similar drawbacks when it comes to stockpiling. They are about 10x the cost of surgical masks.  
            </Text>
            <Text>
              In a stortage, these masks can be reworn, but their effectiveness drops as they are reworn over and over. 
            </Text>
            <br/><br/>
            <Text mt="xl"><b>Reusable elastomeric masks</b></Text>
            <Slider
              style={{width: '200px', marginLeft: '20px'}}
              min={0}
              max={MAX_MASKS / NUM_DAYS}
              label={(value) => value ? `${Math.round(value/10)/100}k` : "0"}
              value={numTypeElas} onChange={setNumTypeElas}
              color="indigo"
              size="sm"
            />
            <img src={elastomericUrl} style={{width: "200px", float: "left"}} />
            <Text>
              These masks offer extremely good protection. To be used correctly, their fit needs to be tested to make sure it forms a tight seal and their filter cartidges need to be replaced about once every few months. They are about 100x the cost of N95 masks. 
            </Text>
            <br/>
            <Text mt="xl"><b>Reusable PAPR masks</b></Text>
            <Slider
              style={{width: '200px', marginLeft: '20px'}}
              min={0}
              max={MAX_MASKS / (PAPR_REUSE_FACTOR * NUM_DAYS)}
              label={(value) => value ? `${Math.round(value/10)/100}k` : "0"}
              value={numTypePapr} onChange={setNumTypePapr}
              color="indigo"
              size="sm"
            />
            <img src={paprUrl} style={{width: "200px", float: "left"}} />
            <Text>
              These masks offer extremely good protection. They also don't require fit testing to be used correctly. They can be used by people who cannot wear other kinds of masks due to head coverings. They take a long time to put on, and require assistance from others during the donning and doffing process. They are about 35x the cost of elastomeric masks.  
            </Text>
            <Text>
              These masks can be shared among multiple users. For example, they could be used by people in the morning shift, disinfected, and then reused by people in the evening shift. 
            </Text>
            <Text>
              Zooming out, you should remember that the above exercise doesn't capture the true need for masks. Worldwide, there are around more than one billion frontline essential workers who will need masks. Furthermore, not everyone who needs a mask is a frontline essential worker. Immunocompromised people also need masks, and in an ideal world, every single person would have access to masks so that they can live without fear of infection. Lastly, the above exercise only focuses on 12 weeks of a pandemic. Real pandemics can last much longer.
            </Text>
          </div>
          <Text mt="xl"><b>Stockpiling</b></Text>
          <Text>
            Broadly speaking, there are two ways to provide PPE to essential workers in the first weeks of a pandemic: stockpiling and flex capacity. 
          </Text>
          <Text>
            Stockpiling means keeping extra PPE in warehouses, to be used in case a pandemic happens. 
          </Text>
          <Text>
            Flex capacity means paying PPE producers to maintain the capability to increase their PPE production very quickly. In ordinary times, PPE producers can produce around {BASELINE_PRODUCTION.toLocaleString()} mask-days of protection per day. In an emergency situation, PPE producers could run their factories 24/7 and increase other efficiencies to produce 3-4x as many masks. In extreme situations where they do a lot of optimization, they might be able to increase that to 10x, and maybe even more.  
          </Text>
          <Text>
            To reiterate, based on your current parameters, you will need {numMasksNeeded().toLocaleString()} mask-days. 
          </Text>
          <Text mt="xl"><b>How much flex capacity do you want PPE producers to maintain?</b></Text>
          <Slider
            style={{width: '200px', marginLeft: '20px'}}
            min={0}
            max={10}
            label={(value) => `${value}x`}
            value={flexCapacity} onChange={setFlexCapacity}
            color="indigo"
            size="sm"
          />
          <Text>
            This will allow you to produce {(flexCapacity * BASELINE_PRODUCTION * NUM_DAYS).toLocaleString()} mask-days using your flex capacity. The masks that will be produced using flex capacity are shown as smaller dots. Thus, you will need to stockpile {Math.max(Math.round(numMasksNeeded() - (flexCapacity * BASELINE_PRODUCTION * NUM_DAYS)), 0).toLocaleString()} masks.
          </Text>
          <Text>
            For most future scenarios, stockpiling is crucial. It is very hard to maintain enough flex capacity to fully address the mask demand we'll have in case of a pandemic. Stockpiling, on the other hand, is much easier to scale. Stockpiling 10x more masks is much easier than maintaining flex capacity to manufacture 10x more masks. The former only requires logistics considerations like finding warehouse space and personnel to manage inventory, instead of requiring answers to complicated manufacturing and optimization problems. 
          </Text>
          <Text mt="xl"><b>Sources</b></Text>
          <Text>
            <ul>
              <li><a href="https://blueprintbiosecurity.org/u/2024/05/Towards-a-Theory-of-Pandemic-Proof-PPE-Blueprint.pdf" target="_blank">Towards a Theory of Pandemic-Proof PPE by Blueprint Biosecurity</a></li>
              <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2727308/" target="_blank">Radonovich LJ, Magalian PD, Hollingsworth MK, Baracco G. Stockpiling supplies for the next influenza pandemic. Emerg Infect Dis. 2009 Jun;15(6):e1. doi: 10.3201/eid1506.081196. PMID: 21970033; PMCID: PMC2727308.</a></li>
              <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8264166/" target="_blank">Blau FD, Koebe J, Meyerhofer PA. Who are the essential and frontline workers? Bus Econ. 2021;56(3):168-178. doi: 10.1057/s11369-021-00230-7. Epub 2021 Jul 8. PMID: 34253931; PMCID: PMC8264166.</a></li>
              <li><a href="https://www.nfpa.org/education-and-research/research/fire-protection-research-foundation/projects-and-reports/total-cost-of-fire-in-the-united-states" target="_blank">Total Cost of Fire in the United States</a></li>
            </ul>
          </Text>
        </MantineProvider>
      </div>
    </>
    
  )
}

export default App;
