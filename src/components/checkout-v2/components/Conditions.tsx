import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Checkbox from '../../checkbox/Checkbox'

export interface Condition {
  id: string
  name: string
  content: string
  is_required: boolean
}

interface ConditionsProps {
  conditions: Condition[]
  acceptedConditions: Record<string, boolean>
  onAcceptCondition: (conditionId: string, isAccepted: boolean) => void
  styles?: {
    container?: object
    title?: object
    conditionButton?: object
    conditionButtonText?: object
    checkbox?: object
    conditionContent?: object
    expandedContent?: object
  }
  texts?: {
    title?: string
    viewButton?: string
    hideButton?: string
    acceptCheckbox?: string
  }
}

const Conditions: React.FC<ConditionsProps> = ({
  conditions,
  acceptedConditions,
  onAcceptCondition,
  styles: customStyles,
  texts,
}) => {
  // Track which conditions are expanded
  const [expandedConditions, setExpandedConditions] = useState<
    Record<string, boolean>
  >({})

  if (!conditions || conditions.length === 0) {
    return null
  }

  const toggleCondition = (conditionId: string) => {
    setExpandedConditions((prev) => ({
      ...prev,
      [conditionId]: !prev[conditionId],
    }))
  }

  return (
    <View style={[styles.container, customStyles?.container]}>
      <Text style={[styles.title, customStyles?.title]}>
        {texts?.title || 'Event Conditions'}
      </Text>

      {conditions.map((condition) => (
        <View key={condition.id} style={styles.conditionRow}>
          <TouchableOpacity
            style={[styles.conditionButton, customStyles?.conditionButton]}
            onPress={() => toggleCondition(condition.id)}
          >
            <Text
              style={[
                styles.conditionButtonText,
                customStyles?.conditionButtonText,
              ]}
            >
              {condition.name} {condition.is_required ? '*' : ''} (
              {expandedConditions[condition.id]
                ? texts?.hideButton || 'Hide'
                : texts?.viewButton || 'View'}
              )
            </Text>
          </TouchableOpacity>

          {expandedConditions[condition.id] && (
            <ScrollView
              style={[styles.expandedContent, customStyles?.expandedContent]}
              nestedScrollEnabled={true}
            >
              <Text
                style={[
                  styles.conditionContent,
                  customStyles?.conditionContent,
                ]}
              >
                {condition.content}
              </Text>
            </ScrollView>
          )}

          {condition.is_required && (
            <Checkbox
              isActive={!!acceptedConditions[condition.id]}
              onPress={() =>
                onAcceptCondition(
                  condition.id,
                  !acceptedConditions[condition.id]
                )
              }
              styles={customStyles?.checkbox}
              text={
                texts?.acceptCheckbox ||
                'I have read and accept these conditions'
              }
            />
          )}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conditionRow: {
    marginBottom: 15,
  },
  conditionButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 5,
  },
  conditionButtonText: {
    color: '#007bff',
  },
  expandedContent: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
    maxHeight: 150,
  },
  conditionContent: {
    fontSize: 14,
    lineHeight: 20,
  },
})

export default Conditions
