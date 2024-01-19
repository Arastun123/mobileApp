import React, { useState } from 'react';
import { View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';

const DropDown = ({ items, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  return (
    <View style={{ padding: 15 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        placeholder={placeholder}
      />
    </View>
  );
};

export default DropDown;