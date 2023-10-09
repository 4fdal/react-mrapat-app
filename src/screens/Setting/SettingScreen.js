import React from 'react'
import { Button, Center, FormControl, Input, Spinner, Toast, View, WarningOutlineIcon } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from 'axios'

export default class SettingScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    state = {
        host: 'http://localhost:8000',
        validate: {
            host: null
        },
        hasWaitingResponse: false
    }

    componentDidMount() {
        AsyncStorage.getItem('HOST').then(host => {
            if (host) this.setState({ host })
        })
    }

    handleSaveSetting = () => {

        this.setState({
            hasWaitingResponse: true,
            validate: {
                host: null
            }
        })

        if (!this.state.host) {
            return this.setState({
                validate: {
                    host: 'Host tidak boleh kosong'
                }
            })
        }

        Axios.get(this.state.host).then(response => {

            return AsyncStorage.setItem('HOST', this.state.host).then(() => {
                Toast.show({
                    title: 'Berhasil memeperbarui pengaturan',
                    status: 'success',
                })
            })

        }).catch(err => {
            Toast.show({
                title: 'Alamat server host tidak valid, silahkah ulangi kembali',
                status: 'error',
            })
        }).finally(() => {
            this.setState({
                hasWaitingResponse: false,
                validate: {
                    host: null
                }
            })
        })

    }

    render() {
        return <Center flex={1}>
            <View
                style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    padding: 40,
                    borderRadius: 20,
                }}
                w={{
                    base: '80%',
                    md: '25%',
                }}>

                <FormControl isInvalid={this.state.validate.host} mt={5}>
                    <FormControl.Label>Server Host</FormControl.Label>
                    <Input
                        value={this.state.host}
                        onChangeText={host => this.setState({ host })}
                        placeholder="Server Host ex. http://example.com"
                    />
                    {this.state.validate.host && (
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}>
                            {this.state.validate.host}
                        </FormControl.ErrorMessage>
                    )}
                </FormControl>

                <Button
                    disabled={this.state.hasWaitingResponse}
                    onPress={this.handleSaveSetting}
                    leftIcon={this.state.hasWaitingResponse && <Spinner size={'sm'} />}
                    mt={30}>
                    Save
                </Button>
            </View>
        </Center>
    }
}