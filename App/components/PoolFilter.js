import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Colors } from '../../assets/fonts/fonts';
import Dropdown from './Dropdown';
import { useGetUsers } from '../api/PoolApis';

export default function PoolFilter({
    searchText,
    onSearchChange,
    resetFilter,
    status,
    setStatus,
    role,
    setRole,
    category,
    setCategory,
    users,
    setUsers,
    onDropdownOpen
}) {
    const { data: userOptions = [] } = useGetUsers();

    const [openDropdown, setOpenDropdown] = useState(null);

    const statusOptions = [
        { id: 1, name: 'All Pools' },
        { id: 2, name: 'Active' },
        { id: 3, name: 'Completed' },
    ];

    const roleOptions = [
        { id: 1, name: 'All Roles' },
        { id: 2, name: 'Creator' },
        { id: 3, name: 'Player' },
    ];

    const categoryOptions = [
        { id: 1, name: 'All Categories' },
        { id: 2, name: 'Sports' },
        { id: 3, name: 'Entertainment' },
        { id: 4, name: 'Trivia' },
        { id: 5, name: 'Competition' },
        { id: 6, name: 'Event' }
    ];

    const handleDropdownToggle = (dropdownName) => {
        const newState = openDropdown === dropdownName ? null : dropdownName;
        setOpenDropdown(newState);
        // 👇 ADD THESE 3 LINES:
        if (onDropdownOpen) {
            onDropdownOpen(newState !== null);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={{ color: Colors.TEXT, fontSize: 14, fontFamily: "Inter-Medium", marginBottom: 5, }}>
                Title
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Search Pools..."
                placeholderTextColor={Colors.SUBTEXT}
                value={searchText}
                onChangeText={onSearchChange}
            />

            <Dropdown
                label="Status"
                value={status}
                onSelect={(item) => {
                    setStatus(item);
                    setOpenDropdown(null);
                    if (onDropdownOpen) onDropdownOpen(false);
                }}
                options={statusOptions}
                isOpen={openDropdown === 'status'}
                onToggle={() => handleDropdownToggle('status')}
            />

            <Dropdown
                label="Your Role"
                value={role}
                onSelect={(item) => {
                    setRole(item);
                    setOpenDropdown(null);
                    if (onDropdownOpen) onDropdownOpen(false);  
                }}
                options={roleOptions}
                isOpen={openDropdown === 'role'}
                onToggle={() => handleDropdownToggle('role')}
            />

            <Dropdown
                label="Category"
                value={category}
                onSelect={(item) => {
                    setCategory(item);
                    setOpenDropdown(null);
                    if (onDropdownOpen) onDropdownOpen(false);  
                }}
                options={categoryOptions}
                isOpen={openDropdown === 'category'}
                onToggle={() => handleDropdownToggle('category')}
            />

            <Dropdown
                label="Users"
                value={users}
                onSelect={(item) => {
                    setUsers(item);
                    setOpenDropdown(null);
                    if (onDropdownOpen) onDropdownOpen(false); 
                }}
                options={userOptions}
                isOpen={openDropdown === 'users'}
                onToggle={() => handleDropdownToggle('users')}
            />

            <TouchableOpacity style={styles.resetButton} onPress={resetFilter}>
                <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.GREY,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },
    input: {
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: Colors.GREY,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: Colors.TEXT,
        marginBottom: 10,
    },
    resetButton: {
        backgroundColor: Colors.TEXT,
        borderRadius: 8,
        borderWidth: 1,
        alignSelf: "flex-end"
    },
    resetText: {
        color: Colors.GREY,
        fontSize: 16,
        fontFamily: "Inter-Medium",
        padding: 5,
        paddingHorizontal: 15,
        alignSelf: 'flex-end',
    }
});
