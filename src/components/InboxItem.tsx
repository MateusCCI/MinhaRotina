import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InboxItem } from '../lib/types';

interface InboxItemProps {
  item: InboxItem;
  onPromote: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function InboxItemComponent({ item, onPromote, onDelete }: InboxItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPromote]}
          onPress={() => onPromote(item.id)}
          accessibilityLabel={`Mover ${item.content} para hoje`}
        >
          <Text style={styles.btnText}>→ Hoje</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnDelete]}
          onPress={() => onDelete(item.id)}
          accessibilityLabel={`Excluir ${item.content}`}
        >
          <Text style={styles.btnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  btnPromote: {
    backgroundColor: '#2563EB',
  },
  btnDelete: {
    backgroundColor: '#FEE2E2',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
