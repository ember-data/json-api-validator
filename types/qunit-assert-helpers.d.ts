declare namespace QUnitAssertHelpers {
    type TestFnThatMayThrow = () => void;

    interface Matchers {
        throwsWith(
            fn: TestFnThatMayThrow,
            messageContains: string,
            assertDescription?: string
        ): void;

        doesNotThrowWith(
            fn: TestFnThatMayThrow,
            messageContains: string,
            assertDescription?: string
        ): void;

        expectWarning(
            fn: TestFnThatMayThrow,
            messageContains: string,
            assertDescription?: string
        ): void
    }
}

interface Assert extends QUnitAssertHelpers.Matchers {

}