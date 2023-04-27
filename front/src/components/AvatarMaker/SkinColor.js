import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/normalize.css'
import { SliderPicker } from 'react-color'

SkinColor.propTypes = {
  currentColor: PropTypes.string,
  handleChangeComplete: PropTypes.func,
  setChanges: PropTypes.func,
  ArrayColors: PropTypes.array,
  changes: PropTypes.object
}

function SkinColor({ currentColor, handleChangeComplete, setChanges, ArrayColors, changes }) {
  return (
    <>
      <div className='avatar__colorPicker'>
        <SliderPicker
          color={currentColor}
          onChangeComplete={handleChangeComplete}
          onChange={(color) =>
            setChanges({ ...changes, sC: color.hex.replace('#', '') })
          }
          colors={ArrayColors}
        />
      </div>
      <div className='avatar__options'><h1>This element has no type uwu</h1></div>
    </>
  )
}

export default SkinColor