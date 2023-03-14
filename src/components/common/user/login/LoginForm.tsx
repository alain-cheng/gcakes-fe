import {
  useSession,
  useSetSession,
} from "@/components/common/hooks/useSession";
import { SX_MASKS } from "@/components/common/util/masks";
import { LOGIN_URL } from "@/components/common/util/urls";
import { Session } from "@/types/session";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  createTheme,
  Grid,
  LinearProgress,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FC, useEffect, useState } from "react";
import { COLOR_PALLETE } from "../../ThemeProvider";

import { setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

type LoginFormProps = {
  onRegisterClick?: () => void;
};

const LoginForm: FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | undefined>();
  const [loading, setIsLoading] = useState(false);

  const session = useSession();
	
	const router = useRouter();


  function handleLogin(e: any) {
    e.preventDefault();

    setIsLoading(true);

    fetch(`${LOGIN_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userId: userid,
        password: password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }

				return res.json().then((result) => {
					const _session: Session = {
						accessToken: result.accessToken,
						currentUser: result.user,
						expiration: new Date(result.exp * 1000)
					};

					setCookie("accessToken", _session.accessToken, {
						expires: _session.expiration,
					});

          router.push(`/${_session.currentUser.userid}/profile`);

        });
      })
      .catch((error) => {
				console.log("error occured ", error);

				deleteCookie("accessToken");

        if (error.message === "Unauthorized!") {
          setError("Incorrect login credentials");
        } else {
          setError("Something went wrong. Please try again");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
	

  return (
    <div // Form Contents
      style={{
        flexGrow: 1,
        backgroundColor: `white`,
        borderRadius: "2rem",
        borderWidth: "5px",
        borderColor: COLOR_PALLETE[4],
        borderStyle: "solid",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: COLOR_PALLETE[4],
          textAlign: "center",
          ...SX_MASKS[0]("bottom"),
          pt: 2,
          pb: 5,
          mb: "1px",
          WebkitMaskSize: "240%",
        }}
      >
        <Typography
          sx={{ fontWeight: "700" }}
          variant="h2"
          color={COLOR_PALLETE[2]}
        >
          Login!
        </Typography>
      </Box>
      <Container
        sx={{
          textAlign: "center",
          pb: 4,
        }}
        maxWidth="xs"
      >
        {error ? (
          <>
            <Alert
              sx={{
                my: 2,
              }}
              severity="error"
            >
              {error}
            </Alert>
          </>
        ) : (
          <></>
        )}

        <form className="loginForm" onSubmit={handleLogin}>
          <Grid
            container
            spacing={5}
            sx={{
              marginTop: "0%",
              "& input": {
                textAlign: "center",
              },
            }}
          >
            <Grid
              sx={{
                pt: "1.5rem !important",
              }}
              item
              xs={12}
            >
              <TextField
                sx={{
                  width: "100%",
                }}
                required
                label="Username"
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError(undefined);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  width: "100%",
                }}
                required
                type="password"
                label="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(undefined);
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {loading ? (
                <CircularProgress></CircularProgress>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={{
                    width: "100%",
                  }}
                  disabled={loading}
                >
                  Login
                </Button>
              )}
            </Grid>
          </Grid>
        </form>

        <Box
          sx={{
            height: 15,
          }}
        ></Box>

        <Grid container>
          <Grid item xs={12}>
            <Typography sx={{ mt: 3 }} variant="subtitle1" color={"GrayText"}>
              Do not have an account yet?
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              href="#"
              color="secondary"
              sx={{
                width: "100%",
              }}
              onClick={onRegisterClick}
            >
              Register Now!
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LoginForm;
