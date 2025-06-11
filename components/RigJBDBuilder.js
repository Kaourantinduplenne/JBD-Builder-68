
import { pdf } from '@react-pdf/renderer';
import { JBDPreviewDocument } from './JBDPreviewDocument';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#FFD433'];
const RIG_OPTIONS = ['DAT', 'DCQ', 'DGD', 'DPN', 'DPS', 'DPT', 'DTH', 'DTN', 'DVS'];

export default function RigJBDBuilder() {
  const diagramRef = useRef(null);
  const [operation, setOperation] = useState('');
  const [rig, setRig] = useState('DAT');
  const [pic, setPic] = useState('');
  const [lofHazard, setLofHazard] = useState('');
  const [diagram, setDiagram] = useState('Pipe Deck');

  const [personnel, setPersonnel] = useState([]);
  const [newPerson, setNewPerson] = useState('');
  const [personPositions, setPersonPositions] = useState({});
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskPersons, setTaskPersons] = useState([]);
  const [zones, setZones] = useState([]);
  const [arrows, setArrows] = useState([]);

  const diagramOptions = {
    DAT: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DCQ: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DGD: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DPN: ["Aft Deck", "Bow Deck","Engine Room Center", "Engine Room Port", "Engine Room Starboard", "FRC", "Helideck Deck", "Moonpool", "Mudpump Room", "Pipe Deck", "Rig Floor", "Riser Deck", "Riser Well Test", "ROV", "Sack Store", "Shale Shaker"],
    DPS: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DPT: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DTH: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DTN: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DVS: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"]
  };

  const getDiagramFileName = (rig, diagram) => `${rig}_${diagram.replace(/\s+/g, '_')}.jpg`;

  const addPerson = () => {
    if (newPerson.trim()) {
      const color = COLORS[personnel.length % COLORS.length];
      setPersonnel([...personnel, { name: newPerson, color }]);
      setNewPerson('');
    }
  };

  const deletePerson = (index) => {
    setPersonnel(personnel.filter((_, i) => i !== index));
    const newPositions = { ...personPositions };
    delete newPositions[index];
    setPersonPositions(newPositions);
  };

  const updatePosition = (index, data) => {
    setPersonPositions({ ...personPositions, [index]: { x: data.x, y: data.y } });
  };

  const addTask = () => {
    if (newTask.trim() && taskPersons.length) {
      setTasks([...tasks, { step: newTask, persons: taskPersons }]);
      setNewTask('');
      setTaskPersons([]);
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const moveTask = (from, to) => {
    if (to < 0 || to >= tasks.length) return;
    const updated = [...tasks];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setTasks(updated);
  };

  const addZone = (color) => {
    setZones([...zones, { id: Date.now(), x: 50, y: 50, w: 100, h: 100, color }]);
  };

  const updateZone = (id, newProps) => {
    setZones(zones.map(z => z.id === id ? { ...z, ...newProps } : z));
  };

  const deleteZone = (id) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const addArrow = (rotation) => {
    setArrows([...arrows, { id: Date.now(), x: 50, y: 50, w: 50, h: 10, rotate: rotation }]);
  };

  const updateArrow = (id, newProps) => {
    setArrows(arrows.map(a => a.id === id ? { ...a, ...newProps } : a));
  };

  const deleteArrow = (id) => {
    setArrows(arrows.filter(a => a.id !== id));
  };

  const generatePDF = async () => {
    const canvas = await html2canvas(diagramRef.current, {
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const imageData = canvas.toDataURL('image/png');
    const doc = (
      <JBDPreviewDocument
        operation={operation}
        rig={rig}
        pic={pic}
        lofHazard={lofHazard}
        personnel={personnel}
        tasks={tasks}
        imageData={imageData}
      />
    );
    const blob = await pdf(doc).toBlob();
    saveAs(blob, 'jbd_preview.pdf');
  };

  return (
    <div style={{ backgroundColor: '#00587C', color: 'white', padding: 20, fontFamily: 'Quantico' }}>
  <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
    <img src="/Transocean Logo_White.png" alt="Transocean Logo" style={{ height: 80, marginRight: 20 }} />
    <h1 style={{ fontSize: "36px", fontWeight: "bold", margin: 0 }}>JBD Builder</h1>
  </div>
  <div style={{ height: "6px", backgroundColor: "#FFB511", marginBottom: "20px" }}></div>
      
      <input style={{ marginBottom: "10px" }} value={operation} style={{ width: "100%", marginBottom: "10px" }} onChange={e => setOperation(e.target.value)} placeholder="Operation" />
      <select style={{ marginBottom: "10px" }} value={rig} style={{ width: "100%", marginBottom: "10px" }} onChange={e => setRig(e.target.value)}>
        {RIG_OPTIONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
      </select>
      <select style={{ marginBottom: "10px" }} value={diagram} style={{ width: "100%", marginBottom: "10px" }} onChange={e => setDiagram(e.target.value)}>
        {diagramOptions[rig]?.map((d, i) => <option key={i} value={d}>{d}</option>)}
      </select>
      <input style={{ marginBottom: "10px" }} value={pic} style={{ width: "100%", marginBottom: "10px" }} onChange={e => setPic(e.target.value)} placeholder="PIC" />
      <textarea style={{ marginBottom: "10px" }} value={lofHazard} style={{ width: "100%", marginBottom: "10px" }} onChange={e => setLofHazard(e.target.value)} placeholder="Line of Fire Hazard" />

      <div>
        <input style={{ marginBottom: "10px" }} value={newPerson} style={{ width: "100%", marginBottom: "10px" }} onChange={e => setNewPerson(e.target.value)} placeholder="Add Personnel" />
        <button onClick={addPerson}>Add</button>
        <ul>
          {personnel.map((p, i) => (
            <li key={i}>
              <span style={{ backgroundColor: p.color, borderRadius: '50%', padding: '2px 6px', marginRight: 5 }}>{i + 1}</span>
              {p.name}
              <button onClick={() => deletePerson(i)}>❌</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <input style={{ marginBottom: "10px" }} value={newTask} style={{ width: "100%", marginBottom: "10px" }} onChange={e => setNewTask(e.target.value)} placeholder="Task Step" />
        <select style={{ marginBottom: "10px" }} multiple value={taskPersons} onChange={e => setTaskPersons(Array.from(e.target.selectedOptions, o => o.value))}>
          {personnel.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
        </select>
        <button onClick={addTask}>Add Task</button>
        <ul>
          {tasks.map((t, i) => (
            <li key={i}>
              {i + 1}. {t.step} - {t.persons.join(', ')}
              <button onClick={() => deleteTask(i)}>❌</button>
              <button onClick={() => moveTask(i, i - 1)}>⬆️</button>
              <button onClick={() => moveTask(i, i + 1)}>⬇️</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => addZone('green')}>Add Step Back</button>
      <button onClick={() => addZone('red')}>Add Red</button>
      <button onClick={() => addZone('black')}>Add Black</button>
      <button onClick={() => addArrow(0)}>Horizontal</button>
      <button onClick={() => addArrow(90)}>Vertical</button>

      <div ref={diagramRef} style={{ width: 800, height: 500, position: 'relative', backgroundColor: 'white' }}>
        <img src={`/${getDiagramFileName(rig, diagram)}`} style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute' }} />
        {zones.map(zone => (
          <Rnd key={zone.id} default={{ x: zone.x, y: zone.y, width: zone.w, height: zone.h }} bounds="parent"
            onDragStop={(e, d) => updateZone(zone.id, { x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, pos) => updateZone(zone.id, { w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...pos })}>
            <div style={{ width: '100%', height: '100%', backgroundColor: zone.color, opacity: 0.3, border: `2px dashed ${zone.color}`, position: 'relative' }}>
              <button onClick={() => deleteZone(zone.id)} style={{ position: 'absolute', top: 0, right: 0 }}>❌</button>
            </div>
          </Rnd>
        ))}
        {arrows.map(arrow => (
          <Rnd key={arrow.id} default={{ x: arrow.x, y: arrow.y, width: arrow.w, height: arrow.h }} bounds="parent"
            onDragStop={(e, d) => updateArrow(arrow.id, { x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, pos) => updateArrow(arrow.id, { w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...pos })}>
            <div style={{ width: '100%', height: '100%', backgroundColor: 'blue', opacity: 0.4, transform: `rotate(${arrow.rotate}deg)`, position: 'relative' }}>
              <button onClick={() => deleteArrow(arrow.id)} style={{ position: 'absolute', top: 0, right: 0 }}>❌</button>
            </div>
          </Rnd>
        ))}
        {personnel.map((p, i) => (
          <Rnd key={i} size={{ width: 30, height: 30 }} position={personPositions[i] || { x: 0, y: 0 }}
            onDragStop={(e, d) => updatePosition(i, d)}
            style={{ backgroundColor: p.color, borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {i + 1}
          </Rnd>
        ))}
      </div>

      <button onClick={generatePDF} style={{ marginTop: 20, backgroundColor: '#FFB511', padding: 10 }}>Capture & Export PDF</button>
    </div>
  );
}
