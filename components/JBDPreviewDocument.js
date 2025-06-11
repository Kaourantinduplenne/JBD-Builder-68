
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#fff', padding: 20 },
  row: { flexDirection: 'row', marginBottom: 10 },
  cell: {
    flex: 1,
    border: '1px solid black',
    borderRadius: 5,
    padding: 10,
    margin: 5
  },
  section: {
    border: '1px solid black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  title: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  image: {
    width: '100%',
    height: 400,
    marginBottom: 10,
    objectFit: 'contain'
  }
});

export const JBDPreviewDocument = ({ operation, rig, pic, lofHazard, personnel = [], tasks = [], imageData }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.row}>
        <View style={styles.cell}><Text>Operation: {operation}</Text></View>
        <View style={styles.cell}><Text>Rig: {rig}</Text></View>
        <View style={styles.cell}><Text>PIC: {pic}</Text></View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Line Of Fire Hazard</Text>
        <Text>{lofHazard}</Text>
      </View>
      {imageData && (
        <View style={styles.section}>
          <Text style={styles.title}>Diagram</Text>
          <Image src={imageData} style={styles.image} />
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.title}>Personnel</Text>
        {personnel.map((p, i) => (
          <Text key={i}>{i + 1}. {p.name}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Task Steps</Text>
        {tasks.map((t, i) => (
          <Text key={i}>{i + 1}. {t.step} - {t.persons.join(', ')}</Text>
        ))}
      </View>
    </Page>
  </Document>
);
