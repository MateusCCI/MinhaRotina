import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HojeItem } from '../lib/types';

interface HojeItemProps {
  item: HojeItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function HojeItemComponent({ item, onToggle, onDelete }: HojeItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, item.checked ? styles.checkboxChecked : undefined]}
        onPress={() => onToggle(item.id)}
        accessibilityLabel={item.checked ? 'Desmarcar' : 'Marcar'}
        accessible
      >
        {item.checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <Text style={[styles.content, item.checked ? styles.checked : undefined]}>
        {item.content}
      </Text>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
        accessibilityLabel="Remover do hoje"
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#F9FAFB',
  },
  checkboxChecked: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
  },
  checked: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 18,
    color: '#EF4444',
  },
});
