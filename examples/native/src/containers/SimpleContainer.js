import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import SimpleForm from '../forms/SimpleForm';

const styles = StyleSheet.create({
    default: {
        marginTop: 15,
    }
});

export default class SimpleContainer extends React.Component {

    constructor() {
        super();
        this.state = {model: {}};
    }

    render() {

        const {model} = this.state;

        return (
            <View style={styles.default}>
                <Text style={styles.default}>{JSON.stringify(model, null, 4)}</Text>
            </View>
        );
    }
}
