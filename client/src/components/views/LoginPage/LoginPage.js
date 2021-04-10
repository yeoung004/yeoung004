import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function LoginPage(props){
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event)  => {

        setEmail(event.currentTarget.value)
    }
    
    const onPasswordHandler = (event)  => {

        setPassword(event.currentTarget.value)
    }
    
    const onSubmitHandler = (event) => {
        //refresh를 방지해줌
        event.preventDefault();

        let body = {
            email : Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess){
                    props.history.push('api/user/')
                } else {
                    alert('로그인에 실패했습니다!')
                }
            })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input type="Password" value={Password} onChange={onPasswordHandler}/>

                <br />
                <button type='submit'>
                    로그인
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)