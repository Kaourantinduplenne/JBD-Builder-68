
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontSize: 12,
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    position: 'relative'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  smallBox: {
    flex: 1,
    border: '1px solid black',
    padding: 6,
    marginRight: 5
  },
  diagramSection: {
    border: '1px solid black',
    padding: 6,
    marginBottom: 10
  },
  diagramImage: {
    width: 680,
    height: 300,
    objectFit: 'contain',
    marginBottom: 5
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  columnBox: {
    flex: 1,
    border: '1px solid black',
    padding: 6
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    fontSize: 8,
    fontFamily: 'Helvetica'
  }
});

export const JBDPreviewDocument = ({ operation, rig, pic, lofHazard, personnel = [], tasks = [], imageData }) => {
  const now = new Date();
  const formatted = now.toLocaleString();

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.row}>
          <View style={styles.smallBox}>
            <Text style={styles.title}>Operation</Text>
            <Text>{operation}</Text>
          </View>
          <View style={styles.smallBox}>
            <Text style={styles.title}>Rig</Text>
            <Text>{rig}</Text>
          </View>
          <View style={styles.smallBox}>
            <Text style={styles.title}>PIC</Text>
            <Text>{pic}</Text>
          </View>
        </View>

        <View style={[styles.smallBox, { marginBottom: 10 }]}>
          <Text style={styles.title}>Line Of Fire Hazard</Text>
          <Text>{lofHazard}</Text>
        </View>

        {imageData && (
          <View style={styles.diagramSection}>
            <Text style={styles.title}>Diagram</Text>
            <Image src={imageData} style={styles.diagramImage} />
          </View>
        )}

        <View style={styles.sectionRow}>
          <View style={styles.columnBox}>
            <Text style={styles.title}>Personnel</Text>
            {personnel.map((p, i) => (
              <Text key={i}>{i + 1}. {p.name}</Text>
            ))}
          </View>
          <View style={styles.columnBox}>
            <Text style={styles.title}>Task Steps</Text>
            {tasks.map((t, i) => (
              <Text key={i}>{i + 1}. {t.step} - {t.persons.join(', ')}</Text>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>Exported: {formatted}</Text>
      </Page>
    </Document>
  );
};
