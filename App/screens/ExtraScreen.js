import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const ExtraScreen = () => {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const fetchData = async () => {        
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts");
            const result = await response.json();
            setData(result);
        }
        catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    const updatedData = data.filter((item) => {
        return item.title.toLowerCase().includes(inputValue.toLowerCase())
    })

    const renderData = ({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.body}</Text>
        </View>
    );
    return (
        <View style={{ flex: 1,justifyContent:"center",alignContent:"center" }}>
            <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                style={{ borderWidth: 1, margin: 10, padding: 10 }}
                placeholder="Search"
            />
            <FlatList
                data={updatedData}
                renderItem={renderData}
            />
        </View>
    )
}

export default ExtraScreen

const styles = StyleSheet.create({})